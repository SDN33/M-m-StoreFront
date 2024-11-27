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
    if (response.data && Array.isArray(response.data)) {
      return response.data; // Retourne les commandes
    } else {
      throw new Error('Aucune commande trouvée.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching user orders from ${process.env.WC_API_DOMAIN}/wp-json/wc/v3/orders:`, error.response?.data || error.message);
    } else {
      console.error('Error fetching user orders:', error);
    }
    throw error;
  }
};

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode HTTP non autorisée' });
  }

  try {
    const orders = await fetchUserOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in handler:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        res.status(500).json({ error: 'Erreur de l\'API WooCommerce, veuillez réessayer plus tard.' });
      } else if (error.request) {
        res.status(500).json({ error: 'Aucune réponse du serveur WooCommerce, veuillez réessayer plus tard.' });
      } else {
        res.status(500).json({ error: 'Erreur interne, veuillez réessayer plus tard.' });
      }
    } else {
      res.status(500).json({ error: 'Erreur inconnue, veuillez réessayer plus tard.' });
    }
  }
}
