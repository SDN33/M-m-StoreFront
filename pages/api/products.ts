import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  price: string; // Assurez-vous que c'est un nombre, sinon convertissez-le
  // Ajoutez d'autres propriétés selon vos besoins
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
