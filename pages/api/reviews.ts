// pages/api/reviews.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';


const WC_BASE_URL = 'https://portailpro-memegeorgette.com/wp-json/wc/v3/products/reviews';
const consumerKey = process.env.WC_CONSUMER_KEY;
const consumerSecret = process.env.WC_CONSUMER_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  try {
    if (method === 'GET') {
      const { page = 1, per_page = 10 } = req.query;

      const response = await axios.get(WC_BASE_URL, {
        auth: {
          username: consumerKey!,
          password: consumerSecret!,
        },
        params: {
          page,
          per_page,
        },
      });
      return res.status(200).json(response.data);
    }

    if (method === 'POST') {
      const { product_id, reviewer, reviewer_email, review, rating } = body;

      if (!product_id || !reviewer || !reviewer_email || !review || !rating) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const response = await axios.post(WC_BASE_URL, {
        product_id,
        reviewer,
        reviewer_email,
        review,
        rating,
      }, {
        auth: {
          username: consumerKey!,
          password: consumerSecret!,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.status(201).json(response.data);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    const axiosError = error as AxiosError;
    res.status(axiosError.response?.status || 500).json({
      message: axiosError.response?.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data ? (axiosError.response.data as { message: string }).message : 'Internal server error',
    });
  }
}
