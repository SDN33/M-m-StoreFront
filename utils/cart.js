// utils/cart.js
import { wcApi } from '../pages/api/wcApi';

// Fonction pour ajouter un produit au panier
export const addToCart = async (productId, qty = 1) => {
  const storedSession = getSession(); // Vérifie s’il existe une session en localStorage
  const config = {
    headers: {
      'X-Headless-CMS': true,
      ...(storedSession ? { 'x-wc-session': storedSession } : {})
    }
  };

  try {
    const res = await wcApi.post('cart/add-item', { product_id: productId, quantity: qty }, config);

    // Stocke la session si elle n'existe pas encore
    if (!storedSession) {
      storeSession(res.headers['x-wc-session']);
    }

    return res.data; // Retourne les informations mises à jour du panier
  } catch (err) {
    console.error('Erreur lors de l’ajout au panier:', err.response ? err.response.data : err.message);
    throw new Error('Échec de l’ajout au panier. Veuillez réessayer.'); // Gestion d'erreur plus explicite
  }
};

// Fonction pour voir le panier
export const viewCart = async () => {
  const storedSession = getSession();
  const config = {
    headers: {
      'X-Headless-CMS': true,
      ...(storedSession ? { 'x-wc-session': storedSession } : {})
    }
  };

  console.log('Session stockée:', storedSession); // Vérification de la session stockée
  console.log('En-têtes de requête:', config.headers); // Vérification des en-têtes

  try {
    const res = await wcApi.get('cart', config);
    console.log('Panier récupéré:', res.data); // Pour vérifier la réponse
    return res.data; // Retourne les informations du panier
  } catch (err) {
    console.error('Erreur lors de la récupération du panier:', err.response?.data || err.message);
    throw new Error('Échec de la récupération du panier. Veuillez réessayer.'); // Gestion d'erreur plus explicite
  }
};

// Fonction pour stocker la session WooCommerce dans localStorage
export const storeSession = (session) => {
  if (!session) return;
  localStorage.setItem('x-wc-session', session); // Stocke la session dans localStorage
};

// Fonction pour récupérer la session WooCommerce depuis localStorage
export const getSession = () => {
  return localStorage.getItem('x-wc-session'); // Récupère la session depuis localStorage
};
