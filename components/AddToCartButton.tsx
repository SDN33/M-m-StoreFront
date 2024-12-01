import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface AddToCartButtonProps {
  productId: number;
  product: object;
  quantity?: number;
  label?: string;
  onAddToCart: () => Promise<void>;

}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
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
      // const response = await addToCart(productId, quantity);
      await new Promise(resolve => setTimeout(resolve, 500));
      addNewCartItem(product, quantity)
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
        className='bg-gradient-to-r from-primary to-red-900 text-white py-2 px-4 rounded transform transition-transform duration-300 hover:scale-105'
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
