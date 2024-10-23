// utils/cart.js
import { wcApi } from '../pages/api/wcApi';

// Fonction pour ajouter un produit au panier
export const addToCart = async (productId, qty = 1) => {
  try {
    // Étape 1 : Faire une requête GET pour récupérer le panier et les en-têtes (nonce et cart-token)
    const response = await fetch(`${process.env.WC_API_URL}/cart/items`);
    const nonce = response.headers.get('nonce');
    const cartToken = response.headers.get('cart-token');

    if (!nonce || !cartToken) {
      throw new Error('Nonce ou cart-token manquant dans la réponse.');
    }

    // Étape 2 : Faire une requête POST pour ajouter un produit au panier
    const res = await wcApi.post('cart/add-item', {
      product_id: productId,
      quantity: qty,
      variations_id: [],


    }, {
      headers: {
        'Content-Type': 'application/json',
        'Nonce': nonce,
        'Cart-Token': cartToken
      }
    });

    // Vérification de la réponse
    console.log('Produit ajouté au panier avec succès:', res.data);
    return res.data; // Retourne les informations mises à jour du panier

  } catch (err) {
    console.error('Erreur lors de l’ajout au panier:', err.message);
    throw new Error(`Échec de l’ajout au panier: ${err.message}`); // Gestion d'erreur plus explicite
  }
};

// Fonction pour voir le panier
export const viewCart = async () => {
  try {
    // Récupérer les éléments du panier
    const response = await fetch(`${process.env.WC_API_URL}/cart/items`);
    const nonce = response.headers.get('nonce');
    const cartToken = response.headers.get('cart-token');

    if (!nonce || !cartToken) {
      throw new Error('Nonce ou cart-token manquant dans la réponse.');
    }

    const cartResponse = await wcApi.get('cart', {
      headers: {
        'Nonce': nonce,
        'Cart-Token': cartToken
      }
    });

    console.log('Panier récupéré:', cartResponse.data);
    return cartResponse.data; // Retourne les informations du panier

  } catch (err) {
    console.error('Erreur lors de la récupération du panier:', err.message);
    throw new Error(`Échec de la récupération du panier: ${err.message}`); // Gestion d'erreur plus explicite
  }
};

// Fonction pour stocker la session WooCommerce dans localStorage
export const storeSession = (session) => {
  if (!session) return;
  localStorage.setItem('x-wc-session', session);
};

// Fonction pour récupérer la session WooCommerce depuis localStorage
export const getSession = () => {
  return localStorage.getItem('x-wc-session');
};
