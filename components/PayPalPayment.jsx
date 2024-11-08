import React, { useState, useEffect } from 'react';
import { loadScript } from "@paypal/paypal-js";

const PayPalPayment = ({ totalPrice, formData, setError, onComplete, title="Confirm Payment" }) => {

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // if (!stripe || !elements) return;
    try {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalPrice
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          return actions.order.capture().then(async (details) => {
            console.log("Paiement réussi:", details);
            onComplete(); // proceed to create order after successful payment
          });
        },
        onError: (error) => {
          console.error("Erreur PayPal Checkout:", error);
          setError("Le paiement a échoué. Veuillez réessayer.");
        },
      }).render('#paypal-button-container');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        id="paypal-button-container" 
        className="bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white py-2 px-4 rounded"
        disabled={!stripe}
      >
        {title}
      </button>
    </form>
  );
};

export default PayPalPayment;