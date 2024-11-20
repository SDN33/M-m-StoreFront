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
  appelation?: string;
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

// Cache pour les produits
const productCache: { [key: string]: Product[] } = {};
const cacheTimestamp: number | null = null;

const transformMetaData = (metaData: { key: string; value: string | string[] }[]): { [key: string]: unknown } => {
  const productData: { [key: string]: unknown } = {};
  let millesime = '';
  let certification = '';
  let region__pays = '';
  let appelation = '';
  let average_rating = '0.00';
  let rating_count = '0';
  let volume = '';
  let nom_chateau = '';
  let accord_mets: string[] = [];
  let cepages: string[] = [];
  let degustation: string[] = [];
  let style = '';
  let degre = '0.0';

  metaData.forEach(({ key, value }) => {
    const cleanKey = key.startsWith('_') ? key.slice(1) : key;

    // Normalisation des valeurs pour les choix multiples
    if (Array.isArray(value)) {
      productData[cleanKey] = value; // Conserve comme tableau
    } else {
      productData[cleanKey] = value || ''; // Sinon, garde une chaîne vide
    }

    // Gestion des cas spécifiques
    switch (key) {
      case 'nom_chateau':
        nom_chateau = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'millesime':
        millesime = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'certification':
        certification = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'region__pays':
        region__pays = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'appellation':
        appelation = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'average_rating':
        average_rating = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'rating_count':
        rating_count = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'volume':
        volume = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'accord_mets':
        accord_mets = Array.isArray(value) ? value : [value]; // S'assurer que c'est un tableau
        break;
      case 'cepages':
        cepages = Array.isArray(value) ? value : [value]; // S'assurer que c'est un tableau
        break;
      case 'degustation':
        degustation = Array.isArray(value) ? value : [value]; // S'assurer que c'est un tableau
        break;
      case 'style':
        style = Array.isArray(value) ? value.join(', ') : value;
        break;
      case 'degre':
        degre = Array.isArray(value) ? value.join(', ') : value;
        break;
    }
  });

  return {
    ...productData,
    millesime,
    certification,
    region__pays,
    appelation,
    average_rating,
    rating_count,
    volume,
    nom_chateau,
    accord_mets,
    cepages,
    degustation,
    style,
    degre,
  };
};

// Fonction pour récupérer les produits via l'API WooCommerce
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
    : `https://portailpro-memegeorgette.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true&per_page=24`;  // Ajout de per_page=12 pour limiter à 12 produits par page

    // Vérification du cache
    const currentTime = Date.now();
    if (productCache[url] && (cacheTimestamp && currentTime - cacheTimestamp < 60000)) { // 1 minute de cache
      return res.status(200).json(productCache[url]);
    }

    try {
      let productsOrCategories = await fetchProducts(url);
      if (!isCategories) {
        // Filtrer uniquement les produits publiés et en stock
        productsOrCategories = (productsOrCategories as Product[]).filter(product =>
          product.status === 'publish' && product.stock_status === 'instock'
        );
        // Filtrage par prix, couleur, etc.
        if (query.price) {
          const priceFilters = Array.isArray(query.price) ? query.price : [query.price];
          for (const priceFilter of priceFilters) {
            const [min, max] = priceFilter.split('_').map(Number);
            const filteredProductsByPrice = (productsOrCategories as Product[]).filter(product => {
              const productPrice = parseFloat(product.price);
              return productPrice >= min && (max === Infinity || productPrice < max);
            });
            productsOrCategories = filteredProductsByPrice;
          }
        }

        // Autres filtres par couleur, région, millésime, certification, etc.
        if (query.color) {
          const colorFilter = Array.isArray(query.color) ? query.color : [query.color];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return colorFilter.includes(product.meta.color || '');
          });
        }

        // Transformation des produits avant de les retourner
        const transformedProducts = await Promise.all((productsOrCategories as Product[]).map(async (product) => {
          const transformedProduct: Product = {
            ...product,
            ...transformMetaData(product.meta_data),
            store_name: product.store_name || '', // Utilisation du nom du vendeur
          };
          return transformedProduct;
        }));

        // Stockage dans le cache
        productCache[url] = transformedProducts;
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
