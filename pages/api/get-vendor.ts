import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type Vendor = {
  id: number;
  name: string;
  display_name: string;
  description: string;
  social: Record<string, string>;
  shop: {
    picture: string;
    banner: string;
  };
  address: {
    city: string;
    postcode: string;
  };
  // Ajoutez d'autres propriétés si nécessaire
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Vendor[] | Vendor | ErrorResponse>
) {
  // Vérification des variables d'environnement
  const { WC_API_DOMAIN, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;
  if (!WC_API_DOMAIN || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return res.status(500).json({ message: 'Missing WooCommerce API credentials in environment variables' });
  }

  try {
    if (req.method === 'POST') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Vendor ID is required' });
      }

      // Requête pour un vendeur spécifique
      const response = await axios.get(`${WC_API_DOMAIN}/wp-json/mvx/v1/vendors/${id}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64')}`
        }
      });

      if (response.status === 200) {
        return res.status(200).json(response.data);
      } else {
        return res.status(response.status).json({ message: response.data.message || 'Failed to fetch vendor data' });
      }
    } else if (req.method === 'GET') {
      // Requête pour tous les vendeurs
      const response = await axios.get(`${WC_API_DOMAIN}/wp-json/mvx/v1/vendors`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64')}`
        }
      });

      if (response.status === 200) {
        return res.status(200).json(response.data);
      } else {
        return res.status(response.status).json({ message: response.data.message || 'Failed to fetch vendors' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error: unknown) {
    console.error('Error fetching vendors:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return res
          .status(error.response.status)
          .json({ message: error.response.data.message || 'API error occurred' });
      } else if (error.request) {
        return res.status(500).json({ message: 'No response received from WooCommerce API' });
      }
    }
    return res.status(500).json({ message: 'Unexpected server error occurred' });
  }
}
