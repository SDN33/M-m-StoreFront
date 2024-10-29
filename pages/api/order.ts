// pages/api/order.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { wcOrderApi } from './wcApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      const { id } = query;
      if (!id) {
        return res.status(400).json({ message: 'Order ID is required' });
      }

      try {
        const response = await wcOrderApi.get(`/${id}`);
        return res.status(200).json(response.data);
      } catch (error) {
        console.error('Error retrieving order:', error);
        return res.status(500).json({ message: 'Failed to retrieve order' });
      }
    
    case 'POST':
      try {
        const orderData = req.body;
        const response = await wcOrderApi.post('/', orderData);
        res.status(200).json(response.data);
      } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Order creation failed' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }

}
