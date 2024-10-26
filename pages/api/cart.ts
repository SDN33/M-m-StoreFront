import { NextApiRequest, NextApiResponse } from 'next';
import { wcApi } from './wcApi'; // Assurez-vous que wcApi est bien configuré

// Fonction pour afficher le panier
export const viewCart = async () => {
  const response = await fetch('/api/cart', {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Échec de la récupération du panier');
  }
  return response.json();
};

// Handler pour les requêtes API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  console.log(`Request method: ${method}`);

  switch (method) {
    case 'GET':
      try {
        console.log('Récupération du panier...');
        const cartData = await wcApi.get('cart');
        console.log('Panier récupéré:', cartData.data);
        return res.status(200).json(cartData.data);
      } catch (error: any) {
        console.error('Erreur lors de la récupération du panier:', error.response?.data || error.message);
        return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
      }

    case 'POST':
      try {
        const { product_id, quantity = 1, variation_id = 0, variation = {}, cart_item_data = {} } = req.body;

        console.log('Données pour ajout au panier:', {
          product_id,
          quantity,
          variation_id,
          variation,
          cart_item_data,
        });

        // Récupérer le nonce et le cart-token
        const nonceResponse = await fetch(`${process.env.WC_API_URL}/cart/items`);
        if (!nonceResponse.ok) throw new Error('Erreur lors de la récupération du nonce et du cart-token');

        const nonce = nonceResponse.headers.get('nonce');
        const cartToken = nonceResponse.headers.get('cart-token');
        if (!nonce || !cartToken) throw new Error("Nonce ou Cart-Token manquant.");

        console.log('Nonce et Cart-Token récupérés:', { nonce, cartToken });

        // Conversion des ID
        const productId = absint(product_id);
        const variationId = absint(variation_id);

        // Récupérer le produit pour vérifier son existence
        const productData = await wcApi.get(`products/${productId}`);
        if (!productData || !productData.data) throw new Error('Produit invalide.');

        console.log('Produit récupéré:', productData.data);

        // Vérification de la quantité
        if (quantity <= 0) throw new Error('La quantité doit être supérieure à zéro.');

        // Gestion de la variation
        if (variationId) {
          const variationData = await wcApi.get(`products/${productId}/variations/${variationId}`);
          if (!variationData || !variationData.data) throw new Error('La variation est invalide.');
          console.log('Variation récupérée:', variationData.data);
        }

        // Ajouter au panier
        const cartItemData = await wcApi.post(
          'cart/add-item',
          { product_id: productId, quantity, variation_id: variationId, variation, cart_item_data },
          {
            headers: {
              'Nonce': nonce,
              'Cart-Token': cartToken,
            },
          }
        );

        console.log('Article ajouté au panier:', cartItemData.data);
        return res.status(200).json(cartItemData.data);
      } catch (error: any) {
        console.error('Erreur lors de l\'ajout au panier:', error.response?.data || error.message);
        return res.status(500).json({ message: error.response?.data?.message || error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Méthode ${method} non autorisée`);
  }
}

// Fonction pour convertir en entier
function absint(value: string | number): number {
  return Math.abs(parseInt(value.toString(), 10)) || 0;
}
