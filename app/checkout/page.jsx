"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../services/order';
import { useCart } from '../../context/CartContext';
import StripePayment from '../../components/StripePayment';
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
  const [disable, setDisable] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  let cartDetails = viewAllCartItems();
  const totalPrice = (cartDetails.total + 10).toFixed(2);


  // Gestion des changements de saisie de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const { firstName, lastName, address1, city, postcode, email, phone } = formData;
    if (!firstName || !lastName || !address1 || !city || !postcode || !email || !phone) {
      // setError('Veuillez remplir tous les champs requis.');
      setDisable(true)
    }else{
      setDisable(false)
    }
  };

  const handleOrderSubmit = async () => {
    setLoading(true);

    try {
      const orderData = {
        payment_method: "stripe",
        payment_method_title: "Stripe",
        set_paid: true,
        billing: { /* Populate billing info */ },
        shipping: { /* Populate shipping info */ },
        line_items: cartDetails.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_lines: [{ method_id: 'flat_rate', method_title: 'Flat Rate', total: '10.00' }],
      };

      const orderResponse = await createOrder(orderData);
      deleteAllCartItems();
      router.push(`/thank-you?order_id=${orderResponse.id}`);
    } catch (error) {
      setError('Order creation failed. Please try again.');
    } finally {
      setLoading(false);
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
            <input name="state" placeholder="Département" onChange={handleInputChange} className="w-full border p-2 rounded"/>
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
            <span>Livraison 24H : <Image className='flex' src="/images/boxtal.png" alt="Chronopost" width="60" height="10" /></span>
            <span>10.00€</span>
          </div>
          <br />
          <div className="flex justify-between font-bold text-xl mb-4">
            <span>Total :</span>
            <span>{(cartDetails.total + 10).toFixed(2)}€</span>
          </div>
          <StripePayment
            totalPrice={totalPrice}
            formData={formData}
            setError={setError}
            onComplete={handleOrderSubmit}
            disable={disable}
          />
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;