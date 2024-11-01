// pages/api/wcApi.ts
import axios from 'axios';

export const wcApi = axios.create({
  baseURL: `${process.env.WC_API_DOMAIN}/wp-json/wc/store/`,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',  // Clé Client
    password: process.env.WC_CONSUMER_SECRET || '' // Secret Client
  }
});

export const wcOrderApi = axios.create({
  baseURL: `${process.env.WC_API_DOMAIN}/wp-json/wc/v3/orders`,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',  // Clé Client
    password: process.env.WC_CONSUMER_SECRET || '' // Secret Client
  }
});
