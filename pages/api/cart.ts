import { NextApiRequest, NextApiResponse } from 'next';
import { wcApi } from './wcApi'; // Assurez-vous que wcApi est correctement configuré pour interagir avec WooCommerce

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
  console.log(`Request method: ${method}`); // Log du type de requête

  switch (method) {
    case 'GET':
      try {
        console.log('Tentative de récupération du panier...');
        const cartData = await wcApi.get('cart');
        console.log('Panier récupéré avec succès:', cartData.data);
        return res.status(200).json(cartData.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
      }

    case 'POST':
      try {
        const { product_id, quantity = 1, variation_id = 0, variation = {}, cart_item_data = {} } = req.body;

        // Récupérer le nonce et le cart-token
        console.log('Tentative de récupération du nonce et du cart-token...');
        const response = await fetch(`${process.env.WC_API_URL}/cart/items`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du nonce');
        }
        const nonce = response.headers.get('nonce');
        const cartToken = response.headers.get('cart-token');
        console.log('Nonce récupéré:', nonce);
        console.log('Cart-Token récupéré:', cartToken);

        // Validation des IDs
        const productId = absint(product_id);
        const variationId = absint(variation_id);
        console.log(`ID produit: ${productId}, ID variation: ${variationId}, Quantité: ${quantity}`);

        // Récupérer le produit
        const productData = await wcApi.get(`products/${productId}`);
        if (!productData) {
          throw new Error('Le produit spécifié n\'existe pas.');
        }

        // Vérifier la quantité
        if (quantity <= 0) {
          throw new Error('La quantité doit être supérieure à zéro.');
        }

        // Gestion des variations
        if (variationId) {
          const variationData = await wcApi.get(`products/${productId}/variations/${variationId}`);
          if (!variationData) {
            throw new Error('La variation spécifiée n\'existe pas.');
          }
        }

        // Ajouter l'article au panier
        console.log('Tentative d\'ajout de l\'article au panier...');
        const cartItemData = await wcApi.post('cart/add-item', {
          product_id: productId,
          quantity,
          variation_id: variationId,
          variation,
          cart_item_data,
        }, {
          headers: {
            'Nonce': nonce,
            'Cart-Token': cartToken,
          },
        });

        console.log('Article ajouté au panier avec succès:', cartItemData.data);
        res.status(200).json(cartItemData.data); // Retourner les données mises à jour du panier
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Erreur inconnue lors de l\'ajout au panier.';
        res.status(500).json({ message: errorMessage });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

// Fonction utilitaire pour convertir en entier
function absint(value: string | number): number {
  return Math.abs(parseInt(value.toString(), 10)) || 0;
}
