import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  price: string; // Assurez-vous que c'est un nombre, sinon convertissez-le
  meta: { [key: string]: string }; // Ajoutez un champ meta pour les métadonnées
  sellerName?: string; // Ajoutez un champ pour le nom du vendeur
  meta_data: { key: string; value: string }[]; // Ajoutez la propriété meta_data
}

interface Category {
  id: number;
  name: string;
  slug: string;
  // Ajoutez d'autres propriétés selon vos besoins
}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

const transformMetaData = (metaData: any[]): { [key: string]: string } => {
  const productData: { [key: string]: string } = {};
  let sellerName = '';

  metaData.forEach(item => {
    const { key, value } = item;

    // Vérifier si l'élément est le nom du vendeur
    if (key === 'nom') {
      sellerName = value; // Récupérer le nom du vendeur
    }

    const cleanKey = key.startsWith('_') ? key.slice(1) : key; // Enlève le préfixe "_" si présent
    productData[cleanKey] = value; // Ajoute les métadonnées au produit
  });

  return { ...productData, sellerName }; // Retourner les données et le nom du vendeur
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method === 'GET') {
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    const isCategories = query.type === 'categories';
    const url = isCategories
      ? `https://vinsmemegeorgette.wpcomstaging.com/wp-json/wc/v3/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
      : `https://vinsmemegeorgette.wpcomstaging.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true`;

    try {
      const response = await axios.get<Product[] | Category[]>(url);
      let productsOrCategories = response.data;

      // Filtrer les produits par tranche de prix
      if (!isCategories && query.price) {
        const priceFilters = Array.isArray(query.price) ? query.price : [query.price];

        for (const priceFilter of priceFilters) {
          const [min, max] = priceFilter.split('_').map(Number); // Décomposer la chaîne "0_10" en [0, 10]

          // Filtrer les produits selon la tranche de prix
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            const productPrice = parseFloat(product.price);
            return productPrice >= min && (max === Infinity || productPrice < max);
          });
        }
      }

      // Si ce n'est pas une catégorie, transformer les métadonnées
      if (!isCategories) {
        productsOrCategories = (productsOrCategories as Product[]).map(product => {
          const { meta_data } = product; // Supposons que meta_data est une propriété de chaque produit
          const { sellerName, ...meta } = transformMetaData(meta_data); // Transformer les métadonnées
          return {
            ...product,
            meta, // Ajouter les métadonnées au produit
            sellerName, // Ajouter le nom du vendeur
          };
        });
      }

      res.status(200).json(productsOrCategories);
    } catch (error) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      const status = axiosError.response?.status || 500;
      const message = axiosError.response?.data.message || 'Erreur de récupération des données.';
      res.status(status).json({ message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
