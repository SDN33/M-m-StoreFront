// path: /api/vendors
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Vendor {
  id: number;
  name: string;
  avatar_url?: string; // URL de l'avatar du vendeur
  store_name: string; // Nom de la boutique
}

interface Product {
  id: number;
  name: string;
  price: string; // Assurez-vous que c'est un nombre, sinon convertissez-le
  meta: { [key: string]: string };
  store_name?: string;
  millesime?: string;
  certification?: string;
  appelation?: string;
  meta_data: { key: string; value: string | string[] }[]; // Modifié pour inclure des tableaux de chaînes
  status: string;
  is_validated?: boolean;
  region__pays?: string;
  average_rating?: string;
  rating_count?: number;
  volume?: string;
  nom_chateau?: string;
  accord_mets?: Array<string>;
  cepages?: Array<string>;
  conservation?: string[];
  style?: string;
}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

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
  let conservation: string[] = [];
  let style = '';

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
      case 'conservation':
        conservation = Array.isArray(value) ? value : [value]; // S'assurer que c'est un tableau
        break;
      case 'style':
        style = Array.isArray(value) ? value.join(', ') : value;
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
    conservation,
    style,
  };
};

const getVendorDetails = async (vendorId: number) => {
  const consumerKey = process.env.WC_CONSUMER_KEY!;
  const consumerSecret = process.env.WC_CONSUMER_SECRET!;
  const vendorUrl = `https://portailpro-memegeorgette.com/wp-json/mvx/v1/vendors/${vendorId}`;

  try {
    const response = await axios.get<Vendor>(vendorUrl, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });
    return response.data; // Retourne les détails du vendeur
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du vendeur:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    const url = `https://portailpro-memegeorgette.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&acf=true`;

    try {
      const response = await axios.get<Product[]>(url);
      const products = response.data;

      // Récupérer les détails des vendeurs et trier les produits par store name
      const vendorMap: { [key: string]: { products: Product[]; vendorImage?: string } } = {};

      await Promise.all(products.map(async product => {
        const { store_name, id, meta_data, status, is_validated } = product;

        if (status === 'publish' || is_validated) {
          const transformedProduct = {
            ...product,
            ...transformMetaData(meta_data),
          };

          if (store_name) {
            if (!vendorMap[store_name]) {
              const vendorDetails = await getVendorDetails(id); // Assurez-vous d'utiliser un ID de vendeur ici
              vendorMap[store_name] = {
                products: [],
                vendorImage: vendorDetails?.avatar_url,
              };
            }

            vendorMap[store_name].products.push(transformedProduct);
          }
        }
      }));

      const sortedVendors = Object.entries(vendorMap).map(([store_name, { products, vendorImage }]) => ({
        store_name,
        products,
        vendorImage,
      }));

      return res.status(200).json(sortedVendors);
    } catch (error) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || axiosError.message;
      return res.status(500).json({ message: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
