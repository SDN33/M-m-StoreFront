"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../services/order';
import { useCart } from '../../context/CartContext';
import { loadScript } from "@paypal/paypal-js";
import Image from 'next/image';

const CheckoutPage = () => {
  const { deleteAllCartItems, viewAllCartItems } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    postcode: '',
    email: '',
    phone: '',
    paymentMethod: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  let cartDetails = viewAllCartItems();

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        await loadScript({ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" });
        console.log("SDK PayPal chargé avec succès");
      } catch (err) {
        console.error("Échec du chargement du SDK PayPal", err);
      }
    };
    loadPayPalScript();
  }, []);

  // Gestion des changements de saisie de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumission de la commande et traitement du paiement PayPal
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs du formulaire
    const { firstName, lastName, address1, city, postcode, email, phone } = formData;
    if (!firstName || !lastName || !address1 || !city || !postcode || !email || !phone) {
      setError('Veuillez remplir tous les champs requis.');
      return;
    }

    setLoading(true);
    setError('');

    if (formData.paymentMethod === 'paypal') {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: (cartDetails.total + 10).toFixed(2),
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          deleteAllCartItems();
          return actions.order.capture().then(async (details) => {
            console.log("Paiement réussi:", details);

            const orderData = {
              payment_method: "paypal",
              payment_method_title: "PayPal",
              set_paid: true,
              billing: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address1,
                city: formData.city,
                postcode: formData.postcode,
                country: 'FR',
                email: formData.email,
                phone: formData.phone,
              },
              shipping: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address1,
                city: formData.city,
                postcode: formData.postcode,
                country: 'FR',
              },
              line_items: cartDetails.items.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
              })),
              shipping_lines: [
                {
                  method_id: 'flat_rate',
                  method_title: 'Tarif forfaitaire',
                  total: '10.00',
                },
              ],
            };

            try {
              const orderResponse = await createOrder(orderData);
              router.push(`/merci?order_id=${orderResponse.id}`);
            } catch {
              setError('La création de la commande a échoué. Veuillez réessayer.');
            } finally {
              setLoading(false);
            }
          });
        },
        onError: (error) => {
          console.error("Erreur PayPal Checkout:", error);
          setError("Le paiement a échoué. Veuillez réessayer.");
          setLoading(false);
        },
      }).render('#paypal-button-container');
    } else {
      const orderData = {
        payment_method: formData.paymentMethod,
        payment_method_title: formData.paymentMethod === 'cod' ? 'Paiement à la livraison' : 'Virement bancaire',
        set_paid: false,
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address1,
          city: formData.city,
          postcode: formData.postcode,
          country: 'FR',
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address1,
          city: formData.city,
          postcode: formData.postcode,
          country: 'FR',
        },
        line_items: cartDetails.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_lines: [
          {
            method_id: 'flat_rate',
            method_title: 'Tarif forfaitaire',
            total: '10.00',
          },
        ],
      };

      try {
        const orderResponse = await createOrder(orderData);
        router.push(`/merci?order_id=${orderResponse.id}`);
      } catch {
        setError('La création de la commande a échoué. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto px-8 mt-56 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-white rounded-lg p-8 px-4 py-4">
          <h2 className="text-2xl font-semibold mb-6">Adresse de livraison</h2>
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <input name="firstName" placeholder="Prénom" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="lastName" placeholder="Nom" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="address1" placeholder="Adresse" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="city" placeholder="Ville" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="postcode" placeholder="Code postal" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="email" placeholder="E-mail" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
            <input name="phone" placeholder="Téléphone" onChange={handleInputChange} required className="w-full border p-2 rounded"/>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-8 px-4 py-4">
          <h3 className="text-xl font-semibold mb-4">Résumé de la commande</h3>
          <ul className="space-y-4 mb-4">
            {cartDetails.items.map((item) => (
              <li key={item.product_id} className="flex justify-between items-center border-b pb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)}€</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold text-lg mb-2">
            <span>Sous-total :</span>
            <span>{(cartDetails.total).toFixed(2)}€</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mb-2">
            <span>Livraison 24H : <Image className='flex' src="/images/chronopost.png" alt="Chronopost" width="60" height="10" /></span>
            <span>10.00€</span>
          </div>
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>Total :</span>
            <span>{(cartDetails.total + 10).toFixed(2)}€</span>
          </div>
          <div>
            <select name="paymentMethod" onChange={handleInputChange} className="w-full border p-2 rounded mb-4">
              <option value="cod">Paiement à la livraison</option>
              <option value="bacs">Virement bancaire</option>
            </select>
            <button
              onClick={handleOrderSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-primary-light py-2 rounded"
            >
              {loading ? "Traitement..." : "Payer"}
            </button>
          </div>
          {formData.paymentMethod === "paypal" && (
            <div id="paypal-button-container" className="mt-6"></div>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
