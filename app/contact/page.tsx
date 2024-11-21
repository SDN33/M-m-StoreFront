'use client';

import React, { useState } from 'react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique pour traiter le formulaire ici
    console.log('Nom:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-28 pb-10 " style={{ paddingTop: '170px' }}> {/* Augmenté padding-top et réduit la largeur max */}
      <div className="rounded-lg shadow-lg p-6 ">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-md font-medium mt-4 bg-primary text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white"
          >
            Envoyer
          </button>
        </form>
      </div>
      <br /><br />
    </div>
  );
};

export default ContactPage;
