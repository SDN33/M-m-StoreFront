'use client';
import { useState } from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour traiter le formulaire ici (par exemple, appel API, etc.)
    console.log('Nom:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Réinitialiser le formulaire après soumission
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 mt-10">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          Contactez-nous
        </h1>
        <h2 className="text-gray-600 text-center mb-6">
          Vous avez une question ou une suggestion ? Nous serions ravis de vous aider !
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Nom
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-orange-500"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;