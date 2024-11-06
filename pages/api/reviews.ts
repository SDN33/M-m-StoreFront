import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Review {
  id: number;
  product_id: number;
  author: string;
  rating: number;
  date_created: string;
  review: string;
}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

const fetchReviews = async (productId: string): Promise<Review[]> => {
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('Consumer key and secret must be provided');
  }

  try {
    console.log(`Fetching reviews for productId: ${productId}`);  // Ajout du log ici
    const response = await axios.get<Review[]>(
      `https://portailpro-memegeorgette.com/wp-json/wc/v3/products/reviews?product=${productId}`,
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      }
    );
    console.log('Reviews fetched successfully:', response.data);  // Log après la récupération
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);  // Log d'erreur
    throw error;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method === 'GET') {
    const { id } = query; // ID du produit

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
      const reviews = await fetchReviews(id as string);
      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Error in handler:', error);  // Log d'erreur côté serveur
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      const errorMessage = axiosError?.response?.data.message || 'Erreur lors de la récupération des avis';
      return res.status(500).json({ message: errorMessage });
    }
  }

  return res.setHeader('Allow', ['GET']).status(405).end(`Method ${method} Not Allowed`);
}
