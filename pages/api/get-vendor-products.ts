import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

// Types
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  status: string;
  stock_status: string;
  images: {
    id: number;
    src: string;
    alt: string;
  }[];
  // Ajoutez d'autres propriétés selon vos besoins
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | ErrorResponse>
) {
  // Vérification des variables d'environnement
  const { WC_API_DOMAIN, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } = process.env;

  if (!WC_API_DOMAIN || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return res.status(500).json({
      message: 'Missing WooCommerce API credentials in environment variables'
    });
  }

  // Vérification de la méthode HTTP
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    // Récupération du vendor ID depuis les query parameters
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    // Construction de l'URL avec les paramètres
    const apiUrl = `${WC_API_DOMAIN}/wp-json/wc/v2/products`;

    // Requête vers l'API WooCommerce
    const response = await axios.get(apiUrl, {
      params: {
        vendor: vendorId,
        // Ajoutez d'autres paramètres si nécessaire
        // per_page: 100, // Nombre de produits par page
        // page: 1,      // Numéro de page
        // status: 'publish', // Statut des produits
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
        ).toString('base64')}`
      }
    });

    if (response.status === 200) {
      // Transformation/filtrage des données si nécessaire
      type WooCommerceProduct = {
        id: number;
        name: string;
        description: string;
        price: string;
        regular_price: string;
        sale_price: string;
        status: string;
        stock_status: string;
        images: {
          id: number;
          src: string;
          alt: string;
        }[];
        // Ajoutez d'autres propriétés selon vos besoins
      };

      const products: Product[] = response.data.map((product: WooCommerceProduct) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        status: product.status,
        stock_status: product.stock_status,
        images: product.images,
        // Ajoutez d'autres champs selon vos besoins
      }));

      return res.status(200).json(products);
    } else {
      return res.status(response.status).json({
        message: response.data.message || 'Failed to fetch vendor products'
      });
    }

  } catch (error: unknown) {
    console.error('Error fetching vendor products:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return res.status(error.response.status).json({
          message: error.response.data.message || 'API error occurred'
        });
      } else if (error.request) {
        return res.status(500).json({
          message: 'No response received from WooCommerce API'
        });
      }
    }

    return res.status(500).json({
      message: 'Unexpected server error occurred'
    });
  }
}
