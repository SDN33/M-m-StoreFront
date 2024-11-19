// path: /api/products
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  price: string; // Assurez-vous que c'est un nombre, sinon convertissez-le
  sale_price: string; // Assurez-vous que c'est un nombre, sinon convertissez-le
  meta: { [key: string]: string };
  store_name?: string;
  millesime?: string;
  certification?: string;
  appelation?: string;
  meta_data: { key: string; value: string | string[] }[]; // Modifié pour inclure des tableaux de chaînes
  status: string;
  is_validated?: boolean;
  region__pays?: string;
  vendor_image?: string; // URL de l'avatar du vendeur
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
      ? `https://portailpro-memegeorgette.com/wp-json/wc/v3/products/categories?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
      : `https://portailpro-memegeorgette.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true`;

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
        // Filtrer par prix
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

        // Filtrer par couleur
        if (query.color) {
          const colorFilter = Array.isArray(query.color) ? query.color : [query.color];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return colorFilter.includes(product.meta.color || '');
          });
        }

        // Filtrer par région
        if (query.region) {
          const regionFilter = Array.isArray(query.region) ? query.region : [query.region];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return regionFilter.includes(product.region__pays || '');
          });
        }

        // Filtrer par millésime
        if (query.vintage) {
          const vintageFilter = Array.isArray(query.vintage) ? query.vintage : [query.vintage];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return vintageFilter.includes(product.millesime || '');
          });
        }

        // Filtrer par certification
        if (query.certification) {
          const certificationFilter = Array.isArray(query.certification) ? query.certification : [query.certification];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return certificationFilter.includes(product.certification || '');
          });
        }

        // Filtrer par style
        if (query.style) {
          const styleFilter = Array.isArray(query.style) ? query.style : [query.style];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return styleFilter.includes(product.style || '');
          });
        }

        // Filtrer par volume
        if (query.volume) {
          const volumeFilter = Array.isArray(query.volume) ? query.volume : [query.volume];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return volumeFilter.includes(product.volume || '');
          });
        }

        // Filtrer par accord_mets
        if (query.accord_mets) {
          const accordMetsFilter = Array.isArray(query.accord_mets) ? query.accord_mets : [query.accord_mets];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return accordMetsFilter.some(accord => product.accord_mets?.includes(accord));
          });
        }

        const transformedProducts = await Promise.all((productsOrCategories as Product[]).map(async (product) => {
          const transformedProduct: Product = {
            ...product,
            ...transformMetaData(product.meta_data),
            store_name: product.store_name || '', // Utilisation du nom du vendeur
          };
          return transformedProduct;
        }));


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
