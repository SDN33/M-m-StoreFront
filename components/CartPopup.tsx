// components/CartPopup.tsx
import React, { useEffect, useState } from 'react';
import { viewCart } from '../pages/api/cart'; // Vérifiez que le chemin est correct

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  interface CartItem {
    product_id: string;
    name: string;
    quantity: number;
    price: number; // Assurez-vous que le prix est inclus dans l'API
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (isOpen) {
        setLoading(true);
        setError(null);

        try {
          const cartData = await viewCart();
          setCartItems(cartData.items || []);
        } catch (err) {
          console.error('Erreur lors de la récupération du panier:', err);
          setError('Échec de la récupération du panier. Veuillez réessayer.');
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

  if (!isOpen) return null;

  // Calculer le total du panier
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                {cartItems.length === 0 ? (
                  <p>Votre panier est vide</p>
                ) : (
                  <div>
                    <ul className="mb-4">
                      {cartItems.map((item) => (
                        <li key={item.product_id} className="flex justify-between mb-2">
                          <span>{item.name}</span>
                          <span>Quantité : {item.quantity}</span>
                          <span>Prix : {item.price} €</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between font-semibold">
                      <span>Total :</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">Passer à la caisse</button>
                  </div>
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
