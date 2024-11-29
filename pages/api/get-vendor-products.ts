import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';

// Configuration du cache avec des paramètres optimisés
const productCache = new NodeCache({
  stdTTL: 3600, // Durée de vie du cache : 1 heure
  checkperiod: 600, // Vérification du cache toutes les 10 minutes
  useClones: false, // Désactive la création de clones pour améliorer les performances
  maxKeys: 500 // Limite le nombre de clés en cache
});

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
  // Vérification des variables d'environnement avec déstructuration optimisée
  const {
    WC_API_DOMAIN: domain,
    WC_CONSUMER_KEY: consumerKey,
    WC_CONSUMER_SECRET: consumerSecret
  } = process.env;

  if (!domain || !consumerKey || !consumerSecret) {
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
    // Récupération du vendor ID avec validation rapide
    const vendorId = req.query.vendorId as string;
    if (!vendorId) {
      return res.status(400).json({ message: 'ID du vendeur requis' });
    }

    // Clé de cache unique et compacte
    const cacheKey = `vp_${vendorId}`;

    // Vérification du cache avec méthode optimisée
    const cachedProducts = productCache.get<Product[]>(cacheKey);
    if (cachedProducts) {
      return res.status(200).json(cachedProducts);
    }

    // Configuration Axios avec des paramètres optimisés
    const axiosInstance = axios.create({
      baseURL: `${domain}/wp-json/wc/v2/products`,
      timeout: 5000, // Timeout de 5 secondes
      headers: {
        'Authorization': `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    // Requête avec gestion d'erreur et récupération rapide
    const { data: rawProducts } = await axiosInstance.get('', {
      params: {
        vendor: vendorId,
        _fields: 'id,name,description,price,regular_price,sale_price,status,stock_status,images',
        per_page: 100,
        page: 1,
        status: 'publish'
      }
    });

    // Transformation des données avec filtrage précoce et minimal
    const products: Product[] = rawProducts.map((product: Product) => ({
      ...product,
      description: product.description || '',
      images: product.images.map(img => ({
        id: img.id,
        src: img.src,
        alt: img.alt || product.name
      })),
      vendorId
    }));

    // Mise en cache rapide avec options
    productCache.set(cacheKey, products, 3600);

    return res.status(200).json(products);

  } catch (error: unknown) {
    // Gestion d'erreur avec log conditionnel
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erreur de récupération des produits du vendeur:', error);
    }

    const errorResponse: Record<number, string> = {
      500: 'Erreur serveur inattendue',
      404: 'Vendeur ou produits non trouvés',
      403: 'Accès non autorisé',
      304: 'Aucune modification'
    };

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      return res.status(status).json({
        message: errorResponse[status] || 'Erreur de l\'API'
      });
    }

    return res.status(500).json({
      message: 'Erreur serveur inattendue'
    });
  }
}
