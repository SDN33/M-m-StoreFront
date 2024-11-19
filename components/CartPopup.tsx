import React, { useEffect, useState } from 'react';
// import { emptyCart } from '../services/cart';
// import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItem {
  product_id: number;
  name: string;
  image: string;
  images: string[];
  categories: string[];
  quantity: number;
  price: number;
}

const CartPopup: React.FC<CartPopupProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartTotal: total, cartItems, deleteAllCartItems } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      if (isOpen) {
        setLoading(true);
        setError(null);
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
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
    onClose();
    // emptyCart(); // For Api
  };
  const handleCheckout = async () => {
    router.push(`/checkout`);
    await new Promise(resolve => setTimeout(resolve, 500));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
        <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Mon Panier</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
            aria-label="Fermer le panier"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center p-4">{error}</p>
          ) : cartItems.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-600 mb-4">Votre panier est vide</p>
              <p className="text-sm text-gray-500">Découvrez nos vins bio en direct des vignerons !</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-h-[50vh] overflow-y-auto">
                {cartItems.map((item: CartItem) => (
                  <div key={item.product_id} className="flex items-start py-4 border-b border-gray-200">
                    <div className="flex-shrink-0 w-20 h-20 relative">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Vin {item.categories?.join(', ') || 'Vin'}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">Quantité: {item.quantity}</span>
                        <span className="font-medium text-[#FF6B4A]">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                      {item.quantity > 1 && (
                        <div className="flex justify-between items-center">
                          <span className='text-xs'>Prix à l&apos;unité : {item.price} €</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-lg">Total</span>
                  <span className="font-bold text-xl text-[#FF6B4A]">{total.toFixed(2)} €</span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleEmptyCart}
                    className="w-full py-2 px-4 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition"
                  >
                    Vider le panier
                  </button>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary to-rose-800 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white rounded transition font-medium text-center block"
                  >
                    Passer la commande
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .loader {
          border: 3px solid rgba(255, 107, 74, 0.1);
          border-radius: 50%;
          border-top-color: #FF6B4A;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CartPopup;
