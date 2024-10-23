// utils/cartUtils.ts
export const addToCart = async (productId: string, quantity: number) => {
  try {
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l’ajout au panier');
    }

    const cartData = await response.json();
    return cartData; // Renvoie les données mises à jour du panier
  } catch (error) {
    console.error('Erreur dans addToCart:', error);
    throw error; // Relance l'erreur pour que l'appelant puisse gérer l'erreur
  }
};
