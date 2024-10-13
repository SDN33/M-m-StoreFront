import axios from 'axios';

// pages/api/products.js

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    const consumerKey = process.env.WC_CONSUMER_KEY as string;
    const consumerSecret = process.env.WC_CONSUMER_SECRET as string;

    if (!consumerKey || !consumerSecret) {
      return res.status(500).json({ error: 'Consumer key or secret ne sont pas définis' });
    }

    const url = `https://vinsmemegeorgette.wpcomstaging.com/wp-json/wc/v3/products`;

    try {
      const response = await axios.get(url, {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      });
      const products = response.data;
      return res.status(200).json(products);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite';
      return res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
