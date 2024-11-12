//path: pages/api/get-vendor.ts
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type Vendor = {
  id: number;
  name: string;
  description: string;
  social: Record<string, string>;
  picture: string;
  banner: string;
  // Add more properties as needed
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Vendor[] | ErrorResponse>
) {
  try {
    if (req.method === 'POST') {
      const { id } = req.body;

      if (id) {
        const response = await axios.get(`${process.env.WC_API_DOMAIN}/wp-json/mvx/v1/vendors/${id}`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`
          }
        });

        if (response.status !== 200) {
          return res.status(response.status).json({ message: 'Failed to fetch vendors' });
        }

        res.status(200).json(response.data);
      } else {
        res.status(302).json({ message: 'ID not Found' });
      }
    } else {

      const response = await axios.get(`${process.env.WC_API_DOMAIN}/wp-json/mvx/v1/vendors`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`
        }
      });

      if (response.status !== 200) {
        return res.status(response.status).json({ message: 'Failed to fetch vendors' });
      }

      res.status(200).json(response.data);
    }
  } catch (error: any) {
    console.error('Error fetching vendors:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.message || 'Error fetching vendors' });
    } else if (error.request) {
      res.status(500).json({ message: 'No response from server' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
