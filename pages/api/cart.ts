import { NextApiRequest, NextApiResponse } from 'next';
import { wcApi } from './wcApi'; // Assurez-vous que wcApi est correctement configuré pour interagir avec WooCommerce

// Fonction pour afficher le panier
export const viewCart = async () => {
  const response = await fetch(`${process.env.WC_API_URL}/cart`, {
    method: 'GET',
    headers: {
      // Ajoutez des en-têtes si nécessaire, comme l'authentification
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

// Fonction pour vider le panier
export const emptyCart = async () => {
  const response = await fetch(`${process.env.WC_API_URL}/cart/empty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authentification si nécessaire
    },
  });

  if (!response.ok) {
    throw new Error('Failed to empty cart');
  }

  return response.json(); // Retourne les données si nécessaire
};

// Handler pour gérer les requêtes API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  console.log(`Request method: ${method}`); // Log du type de requête

  switch (method) {
    case 'GET':
      try {
        console.log('Tentative de récupération du panier...');
        const cartData = await viewCart(); // Utiliser la fonction viewCart
        console.log('Panier récupéré avec succès:', cartData);
        return res.status(200).json(cartData);
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
      }

    case 'POST':
      // Vérifiez si la requête est pour vider le panier ou ajouter un article
      if (req.body.action === 'empty') {
        try {
          console.log('Tentative de vidange du panier...');
          await emptyCart(); // Appel à la fonction pour vider le panier
          console.log('Panier vidé avec succès.');
          return res.status(200).json({ message: 'Panier vidé avec succès.' });
        } catch (error) {
          console.error('Erreur lors de la vidange du panier:', error);
          return res.status(500).json({ message: 'Erreur lors de la vidange du panier' });
        }
      } else {
        try {
          const { product_id, quantity = 1, variation_id = 0, variation = {}, cart_item_data = {} } = req.body;

          // Log des données reçues
          console.log('Données reçues pour ajouter au panier:', {
            product_id,
            quantity,
            variation_id,
            variation,
            cart_item_data,
          });

          // Récupérer le nonce et le cart-token
          console.log('Tentative de récupération du nonce et du cart-token...');
          const response = await fetch(`${process.env.WC_API_URL}/cart/items`, {
            method: 'GET',
            headers: {
              // Ajoutez des en-têtes si nécessaire
            },
          });
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
          if (!productData || !productData.data) {
            throw new Error('Le produit spécifié n\'existe pas ou n\'est pas valide.');
          }
          console.log('Données du produit récupérées:', productData.data);

          // Vérifier la quantité
          if (quantity <= 0) {
            throw new Error('La quantité doit être supérieure à zéro.');
          }

          // Gestion des variations
          if (variationId) {
            const variationData = await wcApi.get(`products/${productId}/variations/${variationId}`);
            if (!variationData || !variationData.data) {
              throw new Error('La variation spécifiée n\'existe pas.');
            }
            console.log('Données de la variation récupérées:', variationData.data);
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
          return res.status(200).json(cartItemData.data); // Retourner les données mises à jour du panier
        } catch (error) {
          console.error('Erreur lors de l\'ajout au panier:', error);
          const errorMessage = (error instanceof Error) ? error.message : 'Erreur inconnue lors de l\'ajout au panier.';
          return res.status(500).json({ message: errorMessage });
        }
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Fonction utilitaire pour convertir en entier
function absint(value: string | number): number {
  return Math.abs(parseInt(value.toString(), 10)) || 0;
}
