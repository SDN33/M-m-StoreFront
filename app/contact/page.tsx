'use client';

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

const ContactPage = () => {
  const [state, handleSubmit] = useForm("xovqnvab"); // Utilisez votre clé Formspree ici

  if (state.succeeded) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-28 pb-10 mt-20 mb-64" style={{ paddingTop: '170px' }}>
        <div className="rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-600">Merci pour votre message!</h2>
          <p className="text-gray-600 mt-2 ">Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-28 pb-10" style={{ paddingTop: '170px' }}>
      <div className="rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Contactez-nous</h2>
          <p className="text-gray-600">
            Vous avez une question ?<br />Nous serions ravis de vous aider !
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
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
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full py-3 px-6 rounded-md font-medium mt-4 bg-primary text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white disabled:opacity-50"
          >
            {state.submitting ? 'Envoi en cours...' : 'Envoyer'}
          </button>
          <ValidationError errors={state.errors} />
        </form>
      </div>
      <br /><br />
    </div>
  );
};

export default ContactPage;
