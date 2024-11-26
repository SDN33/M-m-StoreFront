import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface Review {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  review_text: string;
  date_created: string;
}

interface AxiosErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

const isValidProductId = (productId: string): boolean => {
  const productIdPattern = /^[a-zA-Z0-9_-]+$/;
  return productIdPattern.test(productId);
};

const fetchYotpoReviews = async (productId: string): Promise<Review[]> => {
  const APP_KEY = process.env.YOTPO_APP_KEY;
  const API_KEY = process.env.YOTPO_SECRET_KEY;

  if (!APP_KEY || !API_KEY) {
    throw new Error('Yotpo API keys are required');
  }

  if (!isValidProductId(productId)) {
    throw new Error('Invalid product ID');
  }

  try {
    const response = await axios.get<Review[]>(
      `https://api.yotpo.com/v1/apps/${APP_KEY}/products/${productId}/reviews`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews from Yotpo:', error);  // Log d'erreur général
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      const errorMessage =
        axiosError?.response?.data.message || 'Error retrieving reviews from Yotpo';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method === 'GET') {
    const { id } = query;  // ID du produit

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
      const reviews = await fetchYotpoReviews(id as string);
      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Error in handler:', error);  // Log d'erreur côté serveur
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ message: errorMessage });
    }
  }

  return res.setHeader('Allow', ['GET']).status(405).end(`Method ${method} Not Allowed`);
}
