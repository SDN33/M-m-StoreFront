import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  price: string;
  // Ajoutez d'autres propriétés selon vos besoins
}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string; // ou les champs que vous attendez
    };
  };
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    const url = `https://vinsmemegeorgette.wpcomstaging.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    try {
      const response = await axios.get<Product[]>(url); // Spécifiez que la réponse est un tableau de produits
      return res.status(200).json(response.data);
    } catch (error) {
      const err = error as AxiosError<AxiosErrorResponse>;
      console.error('Erreur lors de la récupération des produits:', err.response ? err.response.data : err.message);
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
