'use client';
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

const SignupPage = () => {
  const [state, handleSubmit] = useForm("xovqnvab"); // Replace with your Formspree form ID

  if (state.succeeded) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-28 pb-10 mt-20 mb-64" style={{ paddingTop: '170px' }}>
        <div className="rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-600">Merci pour votre inscription!</h2>
          <p className="text-gray-600 mt-2">Nous examinerons votre demande et vous contacterons rapidement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-24 pb-10" style={{ paddingTop: '170px' }}>
      <br /><br /><br /><br />
      <div className="rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Inscription Portail Pro</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="hidden"
            name="_subject"
            value="INSCRIPTION PORTAIL PRO"
          />

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom Complet
            </label>
            <input
              id="name"
              type="text"
              name="Nom"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="domain"
              className="block text-sm font-medium text-gray-700"
            >
              Nom du Domaine
            </label>
            <input
              id="domain"
              type="text"
              name="Domaine"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
            <ValidationError prefix="Domain" field="domain" errors={state.errors} />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Téléphone
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              pattern="^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ex: 06 12 34 56 78"
              maxLength={14}
              required
            />
            <ValidationError prefix="Phone" field="phone" errors={state.errors} />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full py-3 px-6 rounded-md font-medium mt-4 bg-gradient-to-r from-primary to-red-900 text-white hover:scale-105 disabled:opacity-50"
          >
            {state.submitting ? 'Envoi en cours...' : 'S\'inscrire'}
          </button>
          <ValidationError errors={state.errors} />
        </form>
      </div>
      <br />
      <br />
    </div>
  );
};

export default SignupPage;
