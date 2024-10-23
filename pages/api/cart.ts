// pages/api/cart.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { wcApi } from './wcApi';

// Fonction pour afficher le panier
export const viewCart = async () => {
  const response = await fetch('/api/cart', {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

// Handler pour gérer les requêtes API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const cartData = await wcApi.get('cart');
        return res.status(200).json(cartData.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
      }

    case 'POST':
      // Ajout d'articles au panier
      const { productId, quantity } = req.body;
      try {
        const response = await wcApi.post('cart/add-item', { product_id: productId, quantity });
        return res.status(200).json(response.data);
      } catch (error) {
        console.error('Erreur lors de l’ajout au panier:', error);
        return res.status(500).json({ message: 'Erreur lors de l’ajout au panier' });
      }

    case 'PUT':
      // Mise à jour de la quantité d'un article dans le panier
      const { productId: updateProductId, quantity: updateQuantity } = req.body;
      try {
        const response = await wcApi.post('cart/update-item', { product_id: updateProductId, quantity: updateQuantity });
        return res.status(200).json(response.data);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du panier:', error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du panier' });
      }

    case 'DELETE':
      // Suppression d'un article du panier
      const { productId: deleteProductId } = req.body;
      try {
        const response = await wcApi.post('cart/remove-item', { product_id: deleteProductId });
        return res.status(200).json(response.data);
      } catch (error) {
        console.error('Erreur lors de la suppression de l’article du panier:', error);
        return res.status(500).json({ message: 'Erreur lors de la suppression de l’article du panier' });
      }

    default:
      return res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']).status(405).end(`Method ${method} Not Allowed`);
  }
}
