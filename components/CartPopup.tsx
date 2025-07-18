import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { Minus, Plus, CreditCard } from 'lucide-react';

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
  const { cartItems, deleteAllCartItems, updateCartItem, deleteCartItem } = useCart();
  const total = cartItems.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
  const router = useRouter();

  const maxQuantityPerProduct = cartItems.reduce((acc: { [key: number]: number }, item: CartItem) => {
    acc[item.product_id] = (acc[item.product_id] || 0) + item.quantity;
    return acc;
  }, {});
  const hasFreeShipping = Object.values(maxQuantityPerProduct).some((qty): qty is number => typeof qty === 'number' && qty >= 6);
  const maxBottles = Math.max(...Object.values(maxQuantityPerProduct) as number[]);
  const remainingBottlesForFreeShipping = hasFreeShipping ? 0 : 6 - maxBottles;

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

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleEmptyCart = () => {
    deleteAllCartItems();
    onClose();
  };

  const handleCheckout = async () => {
    router.push(`/checkout`);
    await new Promise(resolve => setTimeout(resolve, 500));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
        <div className="bg-gray-950 text-white p-4 rounded-t-lg flex justify-between items-center">
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
              {hasFreeShipping ? (
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-green-600 text-sm font-medium text-center">
                    ✨ Livraison offerte en point relais sur votre commande !
                  </p>
                </div>
              ) : (
                <div className="bg-teal-50 p-3 rounded-md">
                  <p className="text-teal-800 text-sm text-center">
                    Plus que <strong>{remainingBottlesForFreeShipping} bouteille{remainingBottlesForFreeShipping > 1 ? 's' : ''} du même vigneron</strong> pour bénéficier de la <strong>Livraison Offerte en point relais</strong> !
                  </p>
                </div>
              )}

              <div className="max-h-[50vh] overflow-y-auto">
                {cartItems.map((item: CartItem) => (
                  <div key={item.product_id} className="flex items-start py-4 border-b border-gray-200">
                    <div className="flex-shrink-0 w-20 h-20 relative">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          sizes='100%'
                          className="rounded"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Vin {item.categories?.join(', ') || 'Vin'}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                            disabled={item.quantity >= 99}
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                            <button
                            onClick={() => { updateCartItem(item.product_id, 0); deleteCartItem(item.product_id); }}
                            className="ml-4 hover:underline text-xs"
                            aria-label="Retirer le produit"
                            >
                            Retirer
                            </button>
                        </div>
                        <span className="font-medium">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                      {item.quantity > 1 && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Prix à l&apos;unité : {item.price} €</span>
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

                    {/* Logos de paiement */}
                <div className="flex justify-center items-center mx-auto space-x-4 w-fit h-auto mb-8 bg-white rounded-lg p-2">
                  <a href="https://www.visa.fr" title="Visa">
                    <img
                      src="/images/visa.png"
                      alt="Visa"
                      height={30}
                      width={30}
                      sizes="30"
                    />
                  </a>
                  <a href="https://www.mastercard.fr" title="mastercard" aria-label="Mastercard">
                    <img
                      src="/images/mastercard.png"
                      alt="Mastercard"
                      height={30}
                      width={30}
                    />
                  </a>
                  <a href="https://stripe.com/fr" title="Stripe" aria-label="Stripe">
                    <img
                      src="/images/stripe.webp"
                      alt="Stripe"
                      height={50}
                      width={30}
                    />
                  </a>
                  <div className="flex items-center text-gray-600">
                    <CreditCard className="h-4 w-4 mr-1 text-blue-800" />
                    <span className="text-xs font-semibold text-blue-800">Paiement sécurisé</span>
                  </div>
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
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary to-red-900 text-white hover:scale-105 rounded transition-transform  font-medium text-center block"
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
