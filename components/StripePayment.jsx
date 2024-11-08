// StripePayment.jsx
import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ totalPrice, formData, setError, onComplete, title = "Confirm Payment", disable=true }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || loading || disable) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Please fill in your card details.');
      return;
    }

    const cardEmpty = cardElement._empty;
    if (cardEmpty) {
      setError('Please complete the card information.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/api/create-payment-intent', {
        amount: totalPrice,
      });

      const { clientSecret } = data;

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
        onComplete();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "10px 0" }}>
      <CardElement />
      <button
        type="submit"
        className="bg-gradient-to-r from-primary to-rose-500 text-white py-2 px-4 mt-5 rounded"
        disabled={!stripe || loading || disable}
      >
        {loading ? 'Processing...' : title}
      </button>
    </form>
  );
};

const StripePaymentWrapper = (props) => (
  <Elements stripe={stripePromise}>
    <StripePayment {...props} />
  </Elements>
);

export default StripePaymentWrapper;
