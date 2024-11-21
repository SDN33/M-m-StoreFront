import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';

// Configuration du cache en mémoire
const productCache = new NodeCache({
  stdTTL: 3600, // Durée de vie du cache : 1 heure
  checkperiod: 600 // Vérification du cache toutes les 10 minutes
});

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
  vendorId: string | string[];
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
      message: 'Identifiants API WooCommerce manquants'
    });
  }

  // Vérification de la méthode HTTP
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
  }

  try {
    // Récupération du vendor ID depuis les query parameters
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: 'ID du vendeur requis' });
    }

    // Clé de cache unique
    const cacheKey = `vendor_products_${vendorId}`;

    // Vérification du cache
    const cachedProducts = productCache.get<Product[]>(cacheKey);
    if (cachedProducts) {
      return res.status(200).json(cachedProducts);
    }

    // Construction de l'URL avec les paramètres
    const apiUrl = `${WC_API_DOMAIN}/wp-json/wc/v2/products`;

    // Requête vers l'API WooCommerce avec optimisations
    const response = await axios.get(apiUrl, {
      params: {
        vendor: vendorId,
        _fields: 'id,name,description,price,regular_price,sale_price,status,stock_status,images',
        per_page: 100,
        page: 1,
        status: 'publish'
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
        ).toString('base64')}`
      }
    });

    if (response.status === 200) {
      // Transformation/filtrage des données optimisée
      const products: Product[] = response.data.map((product: Omit<Product, 'vendorId'>) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        status: product.status,
        stock_status: product.stock_status,
        images: product.images.map((img: { id: number; src: string; alt: string }) => ({
          id: img.id,
          src: img.src,
          alt: img.alt || product.name
        })),
        vendorId: vendorId
      }));

      // Mise en cache des résultats
      productCache.set(cacheKey, products);

      return res.status(200).json(products);
    } else {
      return res.status(response.status).json({
        message: response.data.message || 'Échec de récupération des produits du vendeur'
      });
    }

  } catch (error: unknown) {
    console.error('Erreur de récupération des produits du vendeur:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return res.status(error.response.status).json({
          message: error.response.data.message || 'Erreur de l\'API'
        });
      } else if (error.request) {
        return res.status(500).json({
          message: 'Aucune réponse de l\'API WooCommerce'
        });
      }
    }

    return res.status(500).json({
      message: 'Erreur serveur inattendue'
    });
  }
}
