import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  price: string; // Assurez-vous que c'est un nombre, sinon convertissez-le
  meta: { [key: string]: string }; // Champ meta pour les métadonnées
  brandname?: string; // Nom du vendeur
  millesime?: string; // Millésime
  certification?: string; // Certification
  appelation?: string; // Ajout de l'appellation
  meta_data: { key: string; value: string }[]; // Propriété meta_data
  status: string; // Statut du produit (e.g., 'publish')
  is_validated?: boolean; // Champ pour vérifier la validation (optionnel)
  region__pays?: string; // Région/pays
  vendor_display_name?: string; // Nom d'affichage du vendeur
  vendor_image?: string; // Image du vendeur
  average_rating?: string; // Évaluation moyenne
  rating_count?: number; // Nombre d'évaluations
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

const transformMetaData = (metaData: { key: string; value: string }[]): { [key: string]: string } => {
  const productData: { [key: string]: string } = {};
  let brandname = ''; // Nom du vendeur
  let millesime = ''; // Millésime
  let certification = ''; // Certification
  let region__pays = ''; // Région/pays
  let appelation = ''; // Appellation
  let average_rating = '0.00'; // Ajout de l'évaluation moyenne
  let rating_count = '0'; // Ajout du nombre de votes

  metaData.forEach((item: { key: string; value: string }) => {
    const { key, value } = item;

    if (key === 'nom_chateau') {
      brandname = value;
    }

    if (key === 'millesime') {
      millesime = value;
    }

    if (key === 'certification') {
      certification = value; // Récupérer la certification
    }

    if (key === 'region__pays') {
      region__pays = value; // Récupérer la région/pays
    }

    if (key === 'appellation') {
      appelation = value; // Récupérer l'appellation
    }

    if (key === 'average_rating') {
      average_rating = value; // Récupérer l'évaluation moyenne
    }

    if (key === 'rating_count') {
      rating_count = value; // Récupérer le nombre d'avis
    }

    const cleanKey = key.startsWith('_') ? key.slice(1) : key;
    productData[cleanKey] = value;
  });

  return {
    ...productData,
    brandname,
    millesime,
    certification,
    region__pays,
    appelation,
    average_rating,
    rating_count
  }; // Inclure les nouvelles propriétés
};

const getVendorDetails = async (vendorId: number) => {
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;
  const vendorUrl = `https://portailpro-memegeorgette.com/wp-json/mvx/v1/vendors/${vendorId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

  try {
    const response = await axios.get(vendorUrl);
    return response.data; // Retourne les détails du vendeur
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du vendeur:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method === 'GET') {
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    const isCategories = query.type === 'categories';
    const url = isCategories
      ? `https://portailpro-memegeorgette.com/wp-json/wc/v3/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
      : `https://portailpro-memegeorgette.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true`;

    try {
      const response = await axios.get<Product[] | Category[]>(url);
      let productsOrCategories = response.data;

      if (!isCategories && query.price) {
        const priceFilters = Array.isArray(query.price) ? query.price : [query.price];

        for (const priceFilter of priceFilters) {
          const [min, max] = priceFilter.split('_').map(Number);

          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            const productPrice = parseFloat(product.price);
            return productPrice >= min && (max === Infinity || productPrice < max);
          });
        }
      }

      if (!isCategories) {
        const transformedProducts = await Promise.all((productsOrCategories as Product[]).map(async product => {
          const { meta_data, id, status, is_validated } = product;
          const { brandname, millesime, certification, region__pays, appelation, average_rating, rating_count, ...meta } = transformMetaData(meta_data);

          // Récupérer les détails du vendeur
          const vendorDetails = await getVendorDetails(id); // Supposons que l'ID du vendeur est le même que celui du produit

          // Filtrer pour ne garder que les produits validés (par exemple, statut 'publish' ou 'is_validated' à true)
          if (status === 'publish' || is_validated) {
            return {
              ...product,
              meta, // Ajouter les métadonnées au produit
              brandname, // Ajouter le nom du château
              millesime, // Ajouter le millésime
              certification, // Ajouter la certification
              region__pays, // Ajouter la région/pays
              appelation, // Ajouter l'appellation
              average_rating, // Ajouter l'évaluation moyenne
              rating_count, // Ajouter le nombre d'avis
              vendor_display_name: vendorDetails?.display_name || '', // Ajouter le nom d'affichage du vendeur
              vendor_image: vendorDetails?.image || '', // Ajouter l'image du vendeur
              rating: `${average_rating} (${rating_count} avis)` // Ajout de l'évaluation formatée
            };
          }
          return null;
        }));

        // Supprimer les produits non validés (ceux qui sont `null`)
        productsOrCategories = (transformedProducts as (Product | null)[]).filter((product): product is Product => product !== null);
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
