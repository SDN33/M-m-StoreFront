import React, { useEffect, useState } from 'react';
import { viewCart } from '../pages/api/cart';

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  interface CartItem {
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string; // URL de l'image du produit
    categories?: string[]; // Catégories du produit
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
          console.log('Données du panier récupérées:', cartData);
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

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const emptyCart = () => {
    // Fonction pour vider le panier
    setCartItems([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Votre Panier</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700"
            aria-label="Fermer le panier"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <span className="loader mr-2"></span> Chargement...
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Votre panier est vide</p>
        ) : (
          <div>
            <table className="w-full border border-gray-200 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b border-gray-200 text-left">Produit</th>
                  <th className="p-2 border-b border-gray-200 text-center">Quantité</th>
                  <th className="p-2 border-b border-gray-200 text-right">Prix</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product_id} className="hover:bg-gray-50">
                    <td className="p-2 border-b border-gray-200 flex items-start">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded mr-2"
                        />
                      )}
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <p className="text-gray-500 text-xs">
                          {item.categories ? item.categories.join(', ') : 'Sans catégorie'}
                        </p>
                      </div>
                    </td>
                    <td className="p-2 border-b border-gray-200 text-center">{item.quantity}</td>
                    <td className="p-2 border-b border-gray-200 text-right">
                      {(item.price * item.quantity).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="p-2 text-right font-semibold">Total :</td>
                  <td className="p-2 text-right font-semibold">{total.toFixed(2)} €</td>
                </tr>
              </tfoot>
            </table>

            <button
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition mb-2"
              onClick={emptyCart}
            >
              Vider le panier
            </button>

            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
              Passer à la caisse
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #3498db;
          width: 20px;
          height: 20px;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CartPopup;
