// components/CartPopup.tsx
import React, { useEffect, useState } from 'react';
import { viewCart } from '../utils/cart'; // Ton utilitaire pour gérer le panier

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  interface CartItem {
    product_id: string;
    name: string;
    quantity: number;
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Ajout d'un état d'erreur

  useEffect(() => {
    const fetchCart = async () => {
      if (isOpen) {
        setLoading(true);
        setError(null); // Réinitialiser l'erreur à chaque ouverture

        try {
          const cartData = await viewCart();
          setCartItems(cartData.items || []); // Utilisation de `cartData.items` si disponible
        } catch (err) {
          console.error('Erreur lors de la récupération du panier:', err);
          setError('Échec de la récupération du panier. Veuillez réessayer.'); // Gestion d'erreur utilisateur
        } finally {
          setLoading(false);
        }
      } else {
        // Réinitialiser le panier si le pop-up est fermé
        setCartItems([]);
        setLoading(true);
      }
    };

    fetchCart();
  }, [isOpen]);

  if (!isOpen) return null; // Ne rien rendre si le pop-up est fermé

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Votre Panier</h2>
          <button onClick={onClose} className="text-red-500">Fermer</button>
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <>
            {error ? ( // Afficher l'erreur si elle existe
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                {cartItems.length === 0 ? (
                  <p>Votre panier est vide</p>
                ) : (
                  <ul>
                    {cartItems.map((item) => (
                      <li key={item.product_id} className="mb-2">
                        {item.name} - Quantité : {item.quantity}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
