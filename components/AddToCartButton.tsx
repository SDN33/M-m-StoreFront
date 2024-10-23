// components/AddToCartButton.tsx
import React from 'react';
import { addToCart } from '../utils/cartUtils';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number; // Quantité par défaut à 1
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, quantity = 1 }) => {
  const handleAddToCart = async () => {
    console.log(`Tentative d'ajout du produit ${productId} avec une quantité de ${quantity} au panier.`); // Log avant l'ajout

    try {
      await addToCart(productId, quantity);
      console.log(`Produit ${productId} ajouté au panier avec succès !`); // Log après l'ajout réussi
      alert('Produit ajouté au panier !');
      // Vous pouvez également mettre à jour l'état global du panier ici si nécessaire
    } catch (error) {
      console.error('Erreur lors de l’ajout au panier:', error); // Log de l'erreur
      alert('Erreur lors de l’ajout au panier. Veuillez réessayer.');
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      Commander
    </button>
  );
};

export default AddToCartButton;
