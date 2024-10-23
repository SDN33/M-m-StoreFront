// pages/api/cart.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { wcApi } from './wcApi';

export const viewCart = async () => {
  const response = await fetch('/api/cart', {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    try {
      const cartData = await wcApi.get('cart');
      return res.status(200).json(cartData.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
    }
  }

  if (method === 'POST') {
    // Ajoutez des articles au panier ici si nécessaire
    const { productId, quantity } = req.body;

    try {
      const response = await wcApi.post('cart/add-item', { product_id: productId, quantity });
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Erreur lors de l’ajout au panier:', error);
      return res.status(500).json({ message: 'Erreur lors de l’ajout au panier' });
    }
  }

  if (method === 'PUT') {
    // Mettre à jour la quantité d'un article dans le panier
    const { productId, quantity } = req.body;

    try {
      const response = await wcApi.post('cart/add-item', { product_id: productId, quantity });
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Erreur lors de l’ajout au panier:', error);
      return res.status(500).json({ message: 'Erreur lors de l’ajout au panier' });
    }
  }

  if (method === 'DELETE') {
    // Supprimer un article du panier
    const { productId } = req.body;

    try {
      const response = await wcApi.post('cart/remove-item', { product_id: productId });
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Erreur lors de la suppression de l’article du panier:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression de l’article du panier' });
    }
  }

  return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).end(`Method ${method} Not Allowed`);
}
