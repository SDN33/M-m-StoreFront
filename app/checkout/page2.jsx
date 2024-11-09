"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../services/order';
import { useCart } from '../../context/CartContext';
// import StripePayment from '../../components/StripePayment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ totalPrice, formData, setError, onComplete }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    try {
      const { data } = await axios.post('/api/create-payment-intent', {
        amount: totalPrice,
      });

      const { clientSecret } = data;

      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === 'succeeded') {
        onComplete(); // proceed to create order after successful payment
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        className="bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white py-2 px-4 rounded"
        disabled={!stripe}
      >
        Pay with Stripe
      </button>
    </form>
  );
};

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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const cartDetails = viewAllCartItems();
  const totalPrice = (cartDetails.total + 10).toFixed(2);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="mx-auto px-8 mt-56 max-w-4xl">
        <h2>Checkout</h2>
        <div>
          <input name="firstName" placeholder="First Name" onChange={handleInputChange} required />
          <input name="lastName" placeholder="Last Name" onChange={handleInputChange} required />
          <input name="address1" placeholder="Address" onChange={handleInputChange} required />
          <input name="city" placeholder="City" onChange={handleInputChange} required />
          <input name="postcode" placeholder="Postal Code" onChange={handleInputChange} required />
          <input name="email" placeholder="Email" onChange={handleInputChange} required />
          <input name="phone" placeholder="Phone" onChange={handleInputChange} required />
        </div>
        <CheckoutForm
          totalPrice={totalPrice}
          formData={formData}
          setError={setError}
          onComplete={handleOrderSubmit}
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </Elements>
  );
};

export default CheckoutPage;
