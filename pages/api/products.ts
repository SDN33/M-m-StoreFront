// pages/api/products.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Product {
  id: number;
  name: string;
  price: string; // Assurez-vous que c'est un nombre, sinon convertissez-le
  meta: { [key: string]: string };
  store_name?: string;
  millesime?: string;
  certification?: string;
  appelation?: string;
  meta_data: { key: string; value: string }[];
  status: string;
  is_validated?: boolean;
  region__pays?: string;
  vendor_image?: string; // URL de l'avatar du vendeur
  average_rating?: string;
  rating_count?: number;
  volume?: string;
  nom_chateau?: string;
  accords_mets?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

const transformMetaData = (metaData: { key: string; value: string }[]): { [key: string]: string } => {
  const productData: { [key: string]: string } = {};
  let millesime = '';
  let certification = '';
  let region__pays = '';
  let appelation = '';
  let average_rating = '0.00';
  let rating_count = '0';
  let volume = '';
  let nom_chateau = '';
  let accords_mets = '';

  metaData.forEach(({ key, value }) => {
    switch (key) {
      case 'nom_chateau':
        nom_chateau = value; // Corrigé ici pour stocker nom_chateau
        break;
      case 'millesime':
        millesime = value;
        break;
      case 'certification':
        certification = value;
        break;
      case 'region__pays':
        region__pays = value;
        break;
      case 'appellation':
        appelation = value;
        break;
      case 'average_rating':
        average_rating = value;
        break;
      case 'rating_count':
        rating_count = value;
        break;
      case 'volume':
        volume = value;
        break;
      case 'accords_mets':
        accords_mets = value;
        break;
    }
    const cleanKey = key.startsWith('_') ? key.slice(1) : key;
    productData[cleanKey] = value;
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
    accords_mets,
  };
};

const getVendorDetails = async (vendorId: number) => {
  const consumerKey = process.env.WC_CONSUMER_KEY!;
  const consumerSecret = process.env.WC_CONSUMER_SECRET!;
  const vendorUrl = `https://portailpro-memegeorgette.com/wp-json/mvx/v1/vendors/${vendorId}`;

  try {
    const response = await axios.get(vendorUrl, {
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

// Fonction pour convertir les volumes dans un format numérique pour le tri
const convertVolumeToLiters = (volume: string) => {
  if (volume.endsWith('cl')) {
    return parseFloat(volume.replace('cl', '')) / 100; // Convertir cl en litres
  } else if (volume.endsWith('L')) {
    return parseFloat(volume.replace('L', '')); // Garder les litres
  }
  return NaN; // Si ce n'est pas un volume reconnu, retourner NaN
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

    try {
      const response = await axios.get<Product[] | Category[]>(url);
      let productsOrCategories = response.data;

      if (!isCategories) {
        // Filtrer par prix
        if (query.price) {
          const priceFilters = Array.isArray(query.price) ? query.price : [query.price];

          for (const priceFilter of priceFilters) {
            const [min, max] = priceFilter.split('_').map(Number);

            productsOrCategories = (productsOrCategories as Product[]).filter(product => {
              const productPrice = parseFloat(product.price);
              return productPrice >= min && (max === Infinity || productPrice < max);
            });
          }
        }

        // Filtrer par région
        if (query.region) {
          const regionFilter = Array.isArray(query.region) ? query.region : [query.region];
          productsOrCategories = (productsOrCategories as Product[]).filter(product => {
            return regionFilter.includes(product.region__pays || '');
          });
        }

        const transformedProducts = await Promise.all((productsOrCategories as Product[]).map(async product => {
          const { meta_data, id, status, is_validated } = product;
          const { brandname, millesime, certification, region__pays, appelation, average_rating, rating_count, volume, nom_chateau, accords_mets, ...meta } = transformMetaData(meta_data);
          const vendorDetails = await getVendorDetails(id);
          const store_name = product?.store_name || '';

          // Filtrer pour ne garder que les produits validés
          if (status === 'publish' || is_validated) {
            return {
              ...product,
              meta,
              brandname,
              store_name,
              millesime,
              certification,
              region__pays,
              appelation,
              average_rating,
              rating_count,
              nom_chateau,
              volume, // Ajout du volume ici
              vendor_image: vendorDetails?.vendorPhotoUrl || '', // Utilisez vendorPhotoUrl
              rating: `${average_rating} (${rating_count} avis)`,
              accords_mets,
            };
          }
          return null;
        }));

        // Supprimer les produits non validés
        productsOrCategories = (transformedProducts as (Product | null)[]).filter((product): product is Product => product !== null);

        // Tri par volume
        if (query.sortBy === 'volume') {
          productsOrCategories = (productsOrCategories as Product[]).sort((a, b) => {
            const volumeA = convertVolumeToLiters(a.volume || '');
            const volumeB = convertVolumeToLiters(b.volume || '');
            return volumeA - volumeB;
          });
        }
      }

      res.status(200).json(productsOrCategories);
    } catch (error) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      const status = axiosError.response?.status || 500;
      const message = axiosError.response?.data?.message || 'Erreur de récupération des données.';
      res.status(status).json({ message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
