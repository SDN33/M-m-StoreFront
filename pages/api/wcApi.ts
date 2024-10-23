// pages/api/wcApi.ts
import axios from 'axios';

export const wcApi = axios.create({
  baseURL: `https://portailpro-memegeorgette.com/wp-json/wc/store/`, // Utilisation de l'endpoint 'store' pour le panier
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',  // Clé Client
    password: process.env.WC_CONSUMER_SECRET || '' // Secret Client
  }
});
