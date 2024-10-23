import React, { useState } from 'react';
import { viewCart } from '../pages/api/cart'; // Assurez-vous que le chemin est correct

interface AddToCartButtonProps {
  productId: number; // ID du produit à ajouter au panier
  quantity?: number; // Quantité à ajouter au panier
  onAddToCart?: (cartData: any) => void; // Callback pour notifier le parent
  cart_item_data: { [key: string]: string }; // Données supplémentaires pour le produit
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
  onAddToCart,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);

    // Ajouter le produit au localStorage
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = cartData.findIndex((item: { product_id: number; quantity: number }) => item.product_id === productId);

    if (existingProductIndex > -1) {
      cartData[existingProductIndex].quantity += quantity;
    } else {
      cartData.push({ product_id: productId, quantity });
    }

    // Optimistically update local storage
    localStorage.setItem('cart', JSON.stringify(cartData));

    try {
      // Ajoutez ici l'appel à l'API pour ajouter le produit au panier dans WooCommerce
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout au panier dans WooCommerce');
      }

      // Récupérez le panier mis à jour après l'ajout
      const updatedCart = await viewCart();
      console.log('Données du panier mises à jour:', updatedCart);

      // Notifiez le parent avec les nouvelles données
      if (onAddToCart) {
        onAddToCart(updatedCart);
      }

      console.log(`Produit ${productId} ajouté au panier avec succès!`);
    } catch (error) {
      // Rollback local storage if the API call fails
      localStorage.setItem('cart', JSON.stringify(JSON.parse(localStorage.getItem('cart') || '[]').filter((item: { product_id: number; quantity: number }) => item.product_id !== productId)));

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Une erreur inconnue s\'est produite');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className='bg-orange-600 text-white py-2 px-4 rounded'
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? 'Ajout en cours...' : 'Ajouter au panier'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddToCartButton;
