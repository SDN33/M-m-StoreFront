import React from 'react';
import Image from 'next/image';
import StripePayment from '../../components/StripePayment';

const PaymentStep = ({ totalPrice, formData, setError, handleOrderSubmit, isStepComplete, loading, error }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold">Paiement</h2>
        <div className="flex items-center space-x-2">
          <Image
            src="/images/lock-icon.svg"
            alt="Secure"
            width={20}
            height={20}
            className="text-green-600"
          />
          <span className="text-sm text-gray-600">100% Sécurisé</span>
        </div>
      </div>

      <Image
        src="/images/stripe.webp"
        alt="Stripe"
        width={50}
        height={50}
        className="mx-auto sm:mx-0"
      />

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start space-x-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="font-medium text-blue-800">Paiement sécurisé par Stripe</p>
          <p className="text-sm text-gray-600">Vos informations de paiement sont protégées par un cryptage SSL.</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center space-x-3 bg-gray-50 p-4 rounded-lg">
          <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-blue-600">Création de la commande en cours...</p>
        </div>
      )}

      <StripePayment
        totalPrice={totalPrice}
        formData={formData}
        setError={setError}
        onComplete={handleOrderSubmit}
        disable={!isStepComplete(2)}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-red-800 font-medium">Erreur de Paiement</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
