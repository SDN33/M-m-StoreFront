import React from 'react';
import Image from 'next/image';
import StripePayment from '../../components/StripePayment';

const PaymentStep = ({ totalPrice, formData, setError, handleOrderSubmit, isStepComplete, loading, error }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Paiement</h2>
      <Image
        src="/images/stripe.webp"
        alt="Stripe"
        width={80}
        height={80}
        className="mx-auto sm:mx-0"
      />
      <div>
        <p className="font-medium text-gray-950">Paiement sécurisé par Stripe</p>
        <p className="text-sm text-gray-600">Vos informations de paiement sont protégées par un cryptage SSL.</p>
      </div>
      {loading && <p className="text-blue-500">Création de la commande en cours...</p>}
      <StripePayment
        totalPrice={totalPrice}
        formData={formData}
        setError={setError}
        onComplete={handleOrderSubmit}
        disable={!isStepComplete(2)}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default PaymentStep;
