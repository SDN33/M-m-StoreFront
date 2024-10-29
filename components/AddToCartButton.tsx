import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
// import { addToCart } from '../services/cart';

interface AddToCartButtonProps {
  productId: number;
  product: object;
  quantity?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  product,
  quantity = 1,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNewCartItem } = useCart();

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      // const response = await addToCart(productId, quantity);
      await new Promise(resolve => setTimeout(resolve, 500));
      addNewCartItem(product, quantity)
=======
      await addToCart(productId, quantity);
      addNewCartItem(product, quantity);
>>>>>>> 7ace04c8e00beff890705ceefcbfcb52df9550df
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite');
      console.error(error);
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
