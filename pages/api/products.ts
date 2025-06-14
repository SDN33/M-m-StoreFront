// path: /api/products
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
  sans_sulfites_?: string;
  petit_prix?: string;
}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

const productCache: { [key: string]: { data: Product[]; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

const transformMetaData = (metaData: { key: string; value: string | string[] }[]): { [key: string]: unknown } => {
  const productData: { [key: string]: unknown } = {};

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
    degre: '0.0',
    sans_sulfites_: '',
  };

  metaData.forEach(({ key, value }) => {
    const cleanKey = key.startsWith('_') ? key.slice(1) : key;
    productData[cleanKey] = Array.isArray(value) ? value : (value || '');

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
      case 'sans_sulfites_':
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

const fetchProducts = async (url: string): Promise<Product[]> => {
  const response = await axios.get<Product[]>(url, {
    timeout: 10000,
    headers: {
      'Accept-Encoding': 'gzip',
    }
  });
  return response.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', ['GET']).status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { query } = req;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  const isCategories = query.type === 'categories';
  const url = isCategories
    ? `https://portailpro-memegeorgette.com/wp-json/wc/v3/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true`
    : `https://portailpro-memegeorgette.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true&per_page=100`;

  try {
    const currentTime = Date.now();
    const cachedData = productCache[url];
    
    if (cachedData && (currentTime - cachedData.timestamp < CACHE_DURATION)) {
      return res.status(200).json(cachedData.data);
    }

    let productsOrCategories = await fetchProducts(url);

    if (!isCategories) {
      // Filter for published and in-stock products
      productsOrCategories = productsOrCategories.filter(product =>
        product.status === 'publish' && product.stock_status === 'instock'
      );

      // Apply price filter if present
      if (query.price) {
        const priceFilters = Array.isArray(query.price) ? query.price : [query.price];
        productsOrCategories = productsOrCategories.filter(product => {
          const productPrice = parseFloat(product.price);
          return priceFilters.some(priceFilter => {
            const [min, max] = priceFilter.split('_').map(Number);
            return productPrice >= min && (max === Infinity || productPrice < max);
          });
        });
      }

      // Apply color filter if present
      if (query.color) {
        const colorFilter = Array.isArray(query.color) ? query.color : [query.color];
        productsOrCategories = productsOrCategories.filter(product =>
          colorFilter.includes(product.meta.color || '')
        );
      }

      // Transform products with metadata
      const transformedProducts = productsOrCategories.map(product => ({
        ...product,
        ...transformMetaData(product.meta_data),
        store_name: product.store_name || '',
        original_meta: product.meta,
        original_meta_data: product.meta_data
      }));

      // Cache the results
      productCache[url] = {
        data: transformedProducts,
        timestamp: currentTime
      };

      return res.status(200).json(transformedProducts);
    }

    return res.status(200).json(productsOrCategories);

  } catch (error) {
    const axiosError = error as AxiosError<AxiosErrorResponse>;
    const errorMessage = axiosError?.response?.data.message || 'Erreur lors de la récupération des données';
    console.error('API Error:', errorMessage);
    return res.status(500).json({ message: errorMessage });
  }
}
