import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  price: string;
  sale_price: string;
  regular_price: string;
  meta: { [key: string]: string };
  store_name?: string;
  millesime?: string;
  certification?: string;
  appellation?: string;
  meta_data: { key: string; value: string | string[] }[];
  status: string;
  region__pays?: string;
  vendor_image?: string;
  average_rating?: string;
  rating_count?: number;
  volume?: string;
  nom_chateau?: string;
  accord_mets?: Array<string>;
  cepages?: Array<string>;
  degustation?: string[];
  style?: string;
  stock_status?: string;
  degre?: number;

}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

// In-memory cache with simple timestamp-based invalidation
const productCache: { [key: string]: { data: Product[]; timestamp: number } } = {};
const CACHE_DURATION = 60000; // 1 minute cache duration

const transformMetaData = (metaData: { key: string; value: string | string[] }[]): { [key: string]: unknown } => {
  const productData: { [key: string]: unknown } = {};

  // Initialize all potential metadata fields

  const initialMetadata: { [key: string]: string | string[] } = {
    millesime: '',
    certification: '',
    region__pays: '',
    appellation: '',
    average_rating: '0.00',
    rating_count: '0',
    volume: '',
    nom_chateau: '',
    accord_mets: [],
    cepages: [],
    degustation: [],
    style: '',
    degre: '0.0'
  };

  // Process metadata
  metaData.forEach(({ key, value }) => {
    const cleanKey = key.startsWith('_') ? key.slice(1) : key;

    // Store raw metadata
    productData[cleanKey] = Array.isArray(value) ? value : (value || '');

    // Handle specific metadata fields
    switch (key) {
      case 'nom_chateau':
      case 'millesime':
      case 'certification':
      case 'region__pays':
      case 'appellation':
      case 'average_rating':
      case 'rating_count':
      case 'volume':
      case 'style':
      case 'degre':
        initialMetadata[cleanKey] = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'accord_mets':
      case 'cepages':
      case 'degustation':
        initialMetadata[cleanKey] = Array.isArray(value) ? value : [value];
        break;
    }
  });

  return {
    ...productData,
    ...initialMetadata
  };
};

const fetchProducts = async (url: string) => {
  const response = await axios.get<Product[]>(url);
  return response.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method === 'GET') {
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    const isCategories = query.type === 'categories';
    const url = isCategories
      ? `https://portailpro-memegeorgette.com/wp-json/wc/v3/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true`
      : `https://portailpro-memegeorgette.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true&per_page=100`;

    // Check in-memory cache
    const currentTime = Date.now();
    const cachedData = productCache[url];
    if (cachedData && (currentTime - cachedData.timestamp < CACHE_DURATION)) {
      return res.status(200).json(cachedData.data);
    }

    try {
      let productsOrCategories = await fetchProducts(url);

      if (!isCategories) {
        // Filter published and in-stock products
        productsOrCategories = (productsOrCategories as Product[]).filter(product =>
          product.status === 'publish' && product.stock_status === 'instock'
        );

        // Price filtering
        if (query.price) {
          const priceFilters = Array.isArray(query.price) ? query.price : [query.price];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return priceFilters.some(priceFilter => {
              const [min, max] = priceFilter.split('_').map(Number);
              const productPrice = parseFloat(product.price);
              return productPrice >= min && (max === Infinity || productPrice < max);
            });
          });
        }

        // Color filtering
        if (query.color) {
          const colorFilter = Array.isArray(query.color) ? query.color : [query.color];
          productsOrCategories = (productsOrCategories as Product[]).filter(product =>
            colorFilter.includes(product.meta.color || '')
          );
        }

        // Transform products with full metadata
        const transformedProducts = (productsOrCategories as Product[]).map(product => ({
          ...product,
          ...transformMetaData(product.meta_data),
          store_name: product.store_name || '',
          // Include ALL original metadata for maximum flexibility
          original_meta: product.meta,
          original_meta_data: product.meta_data
        }));

        // Store in in-memory cache
        productCache[url] = {
          data: transformedProducts,
          timestamp: currentTime
        };

        return res.status(200).json(transformedProducts);
      } else {
        return res.status(200).json(productsOrCategories);
      }
    } catch (error) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      const errorMessage = axiosError?.response?.data.message || 'Erreur lors de la récupération des données';
      return res.status(500).json({ message: errorMessage });
    }
  }

  return res.setHeader('Allow', ['GET']).status(405).end(`Method ${method} Not Allowed`);
}
