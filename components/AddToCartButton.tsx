import React, { useState } from 'react';
import { viewCart } from '../pages/api/cart'; // Assurez-vous que le chemin est correct

interface AddToCartButtonProps {
  productId: number;
  quantity?: number;
  onAddToCart?: (cartData: { product_id: number; quantity: number }[]) => void;
  cart_item_data: { [key: string]: string };
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  onAddToCart,
  cart_item_data,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);

    try {
      // Ajoute le produit au localStorage
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingProductIndex = cartData.findIndex(
        (item: { product_id: number; quantity: number }) => item.product_id === productId
      );

      if (existingProductIndex > -1) {
        cartData[existingProductIndex].quantity += quantity;
      } else {
        cartData.push({ product_id: productId, quantity });
      }

      // Mise à jour optimiste du localStorage
      localStorage.setItem('cart', JSON.stringify(cartData));

      // Ajoute le produit au panier via l'API WooCommerce
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity, ...cart_item_data }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout au panier dans WooCommerce");
      }

      // Récupération du panier mis à jour
      const updatedCart = await viewCart();
      console.log('Données du panier mises à jour:', updatedCart);

      // Notification des nouvelles données au parent
      if (onAddToCart) {
        onAddToCart(updatedCart);
      }

      console.log(`Produit ${productId} ajouté au panier avec succès!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite');

      // Retrait de l'article ajouté du localStorage
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]').filter(
        (item: { product_id: number }) => item.product_id !== productId
      );
      localStorage.setItem('cart', JSON.stringify(cartData));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className='bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white py-2 px-4 rounded'
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? 'Ajout en cours...' : 'Commander'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddToCartButton;
