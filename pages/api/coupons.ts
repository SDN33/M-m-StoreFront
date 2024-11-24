import axios from 'axios';

const fetchCoupons = async () => {
  try {
    // Appel de l'API WooCommerce pour les coupons
    const response = await axios.get(
      `${process.env.WC_API_DOMAIN}/wp-json/wc/v3/coupons`, // URL de l'API WooCommerce
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY || '', // Clé publique
          password: process.env.WC_CONSUMER_SECRET || '', // Clé secrète
        },
      }
    );
    // Retourne les données des coupons
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching coupons:', error.response?.data || error.message);
    } else {
      console.error('Error fetching coupons:', error);
    }
    throw error;
  }
};

// Call the fetchCoupons function
fetchCoupons().then(coupons => {
  console.log('Fetched coupons:', coupons);
}).catch(error => {
  console.error('Error:', error);
});

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  try {
    const coupons = await fetchCoupons();
    res.status(200).json(coupons);
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'Impossible de récupérer les coupons. Réessayez plus tard.' });
  }
}
