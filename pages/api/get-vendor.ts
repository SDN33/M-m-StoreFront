import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';

// Conservation des types originaux
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
};

type ErrorResponse = {
  message: string;
};

// Configuration du cache
const vendorCache = new NodeCache({
  stdTTL: 3600, // Cache valide pendant 1 heure
  checkperiod: 600 // Vérification du cache tous les 10 minutes
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Vendor[] | Vendor | ErrorResponse>
) {
  const { WC_API_DOMAIN, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;
  if (!WC_API_DOMAIN || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return res.status(500).json({ message: 'Missing WooCommerce API credentials in environment variables' });
  }

  const fetchData = async (url: string, useCache: boolean = true) => {
    const cacheKey = url;

    // Vérifier le cache s'il est activé
    if (useCache) {
      const cachedData = vendorCache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    let retries = 3;
    while (retries > 0) {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64')}`
          }
        });

        // Mettre en cache la réponse
        if (useCache) {
          vendorCache.set(cacheKey, response.data);
        }

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

  const fetchAllVendors = async () => {
    const perPage = 100; // Nombre maximum de vendeurs par page
    let page = 1;
    let allVendors: Vendor[] = [];
    let hasMorePages = true;

    // Récupérer la première page
    const cacheKey = `${WC_API_DOMAIN}/wp-json/mvx/v1/vendors-all`;
    const cachedData = vendorCache.get(cacheKey);

    if (cachedData) {
      return cachedData as Vendor[];
    }

    while (hasMorePages) {
      const url = `${WC_API_DOMAIN}/wp-json/mvx/v1/vendors?per_page=${perPage}&page=${page}`;
      const vendors = await fetchData(url, false);

      if (Array.isArray(vendors) && vendors.length > 0) {
        allVendors = [...allVendors, ...vendors];
        page++;
      } else {
        hasMorePages = false;
      }

      // Si moins de vendeurs que perPage, c'est probablement la dernière page
      if (Array.isArray(vendors) && vendors.length < perPage) {
        hasMorePages = false;
      }
    }

    // Mettre en cache tous les vendeurs
    vendorCache.set(cacheKey, allVendors);
    return allVendors;
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
      // Request for all vendors with pagination
      const allVendors = await fetchAllVendors();
      return res.status(200).json(allVendors);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

  } catch (error: unknown) {
    console.error('Error fetching vendors:', error);
    return res.status(500).json({ message: 'Unexpected server error occurred' });
  }
}
