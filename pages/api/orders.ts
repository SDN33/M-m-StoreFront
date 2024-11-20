import axios from 'axios';

const fetchUserOrders = async () => {
  try {
    const response = await axios.get(
      `${process.env.WC_API_DOMAIN}/wp-json/wc/v3/orders`, // URL de l'API WooCommerce
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY || '', // Clé publique
          password: process.env.WC_CONSUMER_SECRET || '', // Clé secrète
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching user orders:', error.response?.data || error.message);
    } else {
      console.error('Error fetching user orders:', error);
    }
    throw error;
  }
};

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  try {
    const orders = await fetchUserOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'Impossible de récupérer vos commandes. Réessayez plus tard.' });
  }
}
