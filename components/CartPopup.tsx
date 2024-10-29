import React, { useEffect, useState } from 'react';
import { emptyCart } from '../services/cart';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  product_id: number;
  name: string;
  image: string;
  images: string[]; // Ajout des images du produit
  categories: string[];
  quantity: number;
  price: number;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartTotal: total, cartItems, deleteAllCartItems } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      if (isOpen) {
        setLoading(true);
        setError(null);

        try {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simule le chargement
        } catch (err) {
          console.error('Erreur lors de la récupération du panier:', err);
          setError('Échec de la récupération du panier. Veuillez réessayer.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [isOpen]);

  const handleEmptyCart = () => {
    deleteAllCartItems();
    emptyCart(); // Pour l'API
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
          <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <table className="w-full border border-gray-200 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b border-gray-200 text-left">Produit</th>
                  <th className="p-2 border-b border-gray-200 text-center">Quantité</th>
                  <th className="p-2 border-b border-gray-200 text-right">Prix</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item: CartItem) => (
                  <tr key={item.product_id} className="hover:bg-gray-50">
                    <td className="p-2 border-b border-gray-200 flex items-start">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="object-cover rounded mr-2"
                          width={50}
                          height={50}
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
              onClick={handleEmptyCart}
            >
              Vider le panier
            </button>

            <Link href="/checkout" legacyBehavior>
              <a className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition text-center block">
                Passer à la caisse
              </a>
            </Link>
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
          margin: 5px;
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
