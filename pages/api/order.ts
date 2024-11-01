// pages/api/vendors.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Vendor {
  id: number;
  store_name: string;
  avatar: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  stock_status: string;
  vendor_id: number;
}

const fetchVendors = async (consumerKey: string, consumerSecret: string): Promise<Vendor[]> => {
  const url = `https://portailpro-memegeorgette.com/wp-json/mvx/v1/vendors?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
  const response = await axios.get<Vendor[]>(url);
  return response.data;
};

const fetchProductsByVendor = async (vendorId: number, consumerKey: string, consumerSecret: string): Promise<Product[]> => {
  const url = `https://portailpro-memegeorgette.com/wp-json/mvx/v1/vendors/${vendorId}/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
  const response = await axios.get<Product[]>(url);
  return response.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const consumerKey = process.env.WC_CONSUMER_KEY!;
  const consumerSecret = process.env.WC_CONSUMER_SECRET!;

  const { method } = req;

  switch (method) {
    case 'GET': {
      try {
        // Étape 1: Récupérer la liste des vendeurs
        const vendors = await fetchVendors(consumerKey, consumerSecret);

        // Étape 2: Récupérer les produits pour chaque vendeur
        const vendorsWithProducts = await Promise.all(
          vendors.map(async (vendor) => {
            const products = await fetchProductsByVendor(vendor.id, consumerKey, consumerSecret);
            return { ...vendor, products };
          })
        );

        return res.status(200).json(vendorsWithProducts);
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = (axiosError?.response?.data as { message?: string })?.message || 'Erreur lors de la récupération des vendeurs';
        console.error('Error retrieving vendors:', errorMessage);
        return res.status(500).json({ message: errorMessage });
      }
    }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
