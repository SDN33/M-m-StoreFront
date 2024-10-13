// pages/api/products.js
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    const url = `https://vinsmemegeorgette.wpcomstaging.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    try {
      const response = await axios.get(url);
      return res.status(200).json(response.data);
    } catch (error) {
      // Enregistre l'erreur détaillée
      const err = error as unknown as { response?: { data: any }; message: string };
      console.error('Erreur lors de la récupération des produits:', err.response ? err.response.data : err.message);
      return res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
