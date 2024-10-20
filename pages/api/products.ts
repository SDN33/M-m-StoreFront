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
  meta_data: { key: string; value: any }[]; // Modifié pour inclure des tableaux
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
  conservation?: string[];
  style?: string;
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

const transformMetaData = (metaData: { key: string; value: any }[]): { [key: string]: any } => {
  const productData: { [key: string]: any } = {};
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
        nom_chateau = value;
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
        style = value;
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

        const transformedProducts = await Promise.all((productsOrCategories as Product[]).map(async product => {
          const { meta_data, id, status, is_validated } = product;
          const { brandname, millesime, certification, region__pays, appelation, average_rating, rating_count, volume, nom_chateau, accord_mets, cepages, conservation, style, ...meta } = transformMetaData(meta_data);
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
              volume,
              nom_chateau,
              accord_mets,
              cepages,
              conservation,
              style,
              vendor_image: vendorDetails?.avatar_url,
            };
          }
          return null; // Exclure les produits non validés
        }));

        // Supprimer les produits non valides (null)
        const filteredProducts = transformedProducts.filter(product => product !== null);

        return res.status(200).json(filteredProducts);
      } else {
        return res.status(200).json(productsOrCategories);
      }
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
