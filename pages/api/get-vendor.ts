// path pages/api/get-vendor.ts
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
  const { WC_API_DOMAIN, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;
  if (!WC_API_DOMAIN || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return res.status(500).json({ message: 'Missing WooCommerce API credentials in environment variables' });
  }

  const fetchData = async (url: string) => {
    let retries = 3;
    while (retries > 0) {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64')}`
          }
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          // Retry after a delay if rate-limited
          retries -= 1;
          const delay = 1000 * (4 - retries); // Exponential backoff
          console.log(`Rate limit hit, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
    throw new Error('Failed to fetch data after retries');
  };

  try {
    if (req.method === 'POST') {
      const { id } = req.body;
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Valid vendor ID is required' });
      }

      // Request for a specific vendor
      const vendorData = await fetchData(`${WC_API_DOMAIN}/wp-json/mvx/v1/vendors/${encodeURIComponent(id)}`);
      return res.status(200).json(vendorData);

    } else if (req.method === 'GET') {
      // Request for all vendors
      const vendorsData = await fetchData(`${WC_API_DOMAIN}/wp-json/mvx/v1/vendors`);
      return res.status(200).json(vendorsData);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

  } catch (error: unknown) {
    console.error('Error fetching vendors:', error);
    return res.status(500).json({ message: 'Unexpected server error occurred' });
  }
}
