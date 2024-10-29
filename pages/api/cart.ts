import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { wcApi } from './wcApi';


export const getCartNonce = async () => {
    try {
      const response = await wcApi.get('cart/items', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Extracting all headers to find the nonce
      const headers = response.headers;
      const nonce = headers['x-wp-nonce'] || headers['woocommerce-store-api-nonce'] || headers['nonce'];
  
      if (!nonce) {
        throw new Error("Nonce not found in headers.");
      }
  
      return nonce;
    } catch (error) {
      throw error;
    }
  };

const absint = (value: string | number): number => Math.abs(parseInt(value.toString(), 10)) || 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET': // Fetch Cart
      try {
        const response = await wcApi.get('cart');
        const items = response.data.items.map((item: any) => ({
          product_id: item.id?.toString() || '',
          name: item.name || 'Unknown Product',
          quantity: item.quantity || 1,
          price: parseFloat(item.prices.price) || 0.0,
          image: item.images?.[0]?.src || '',
          categories: Array.isArray(item.categories) ? item.categories.map((cat: any) => cat.name) : [],
        }));
        const total = parseFloat(response.data?.totals?.total_price) || 0;
        return res.status(200).json({ total, items });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch cart' });
      }

    case 'POST': // Add, Update, Remove Cart Item
      const { action, product_id, quantity = 1, variation_id = 0, variation = {} } = req.body;

      try {
        const nonce = await getCartNonce();
        const productId = absint(product_id);
        const variationId = absint(variation_id);

        switch (action) {
          case 'add': {
            const addItemResponse = await wcApi.post(
              'cart/add-item',
              { id: productId, quantity, variation_id: variationId, variation },
              { headers: { 'Nonce': nonce } }
            );
            return res.status(200).json(addItemResponse.data);
          }

          case 'update': {
            const updateItemResponse = await wcApi.post(
              'cart/update-item',
              { id: productId, quantity },
              { headers: { 'Nonce': nonce } }
            );
            return res.status(200).json(updateItemResponse.data);
          }

          case 'remove': {
            const removeItemResponse = await wcApi.post(
              'cart/remove-item',
              { id: productId },
              { headers: { 'Nonce': nonce } }
            );
            return res.status(200).json(removeItemResponse.data);
          }

          default:
            return res.status(400).json({ message: 'Invalid action' });
        }
      } catch (error) {
        const message = axios.isAxiosError(error) && error.response ? error.response.data : 'Error with cart action';
        return res.status(500).json({ message });
      }

    case 'DELETE': // Empty Cart
      try {
        const response = await wcApi.delete('cart/items');
        if (response.status === 200) {
          return res.status(200).json({ message: 'Cart emptied successfully' });
        } else {
          return res.status(response.status).json({ message: response.data.message || 'Failed to empty cart' });
        }
      } catch (error) {
        return res.status(500).json({ message: 'Failed to empty cart' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
