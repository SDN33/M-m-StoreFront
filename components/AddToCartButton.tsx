import React, { useState } from 'react';
import { viewCart } from '../pages/api/cart'; // Assurez-vous que le chemin est correct


interface AddToCartButtonProps {
  productId: number; // ID du produit à ajouter au panier
  quantity?: number; // Quantité à ajouter au panier
  onAddToCart?: (productId: number, quantity: number) => void; // Callback pour ajouter au panier
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  quantity = 1,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);

    try {
      // Ajouter le produit au localStorage
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingProductIndex = cartData.findIndex((item: { product_id: number; quantity: number }) => item.product_id === productId);

      if (existingProductIndex > -1) {
        cartData[existingProductIndex].quantity += quantity;
      } else {
        cartData.push({ product_id: productId, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(cartData));

      // Ajoutez ici l'appel à l'API pour ajouter le produit au panier dans WooCommerce
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity }),
      });

      // Récupérez le panier mis à jour après l'ajout
      const updatedCart = await viewCart();
      console.log('Données du panier mises à jour:', updatedCart);

      // Mettez à jour l'état du panier si nécessaire
      // setCartItems(updatedCart.items); // Par exemple, si vous avez une méthode pour cela

      console.log(`Produit ${productId} ajouté au panier avec succès!`);
    } catch (error) {
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
