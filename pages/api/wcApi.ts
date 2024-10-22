// pages/api/wcApi.ts
import axios from 'axios';

const apiBase = process.env.NEXT_PUBLIC_WC_API_BASE_URL; // URL de ton site WooCommerce

export const wcApi = axios.create({
  baseURL: `${apiBase}/wp-json/wc/store/`, // Utilisation de l'endpoint 'store' pour le panier
  auth: {
    username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '',  // Clé Client
    password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '' // Secret Client
  }
});
