'use client'; // Assurez-vous que ce fichier est un composant client

import { useEffect, useState } from 'react';
import { CheckCircle2, Home } from 'lucide-react';
import { useSearchParams } from 'next/navigation'; // Utiliser useSearchParams depuis next/navigation

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // Utiliser useSearchParams de next/navigation ici

  const session_id = searchParams ? searchParams.get('session_id') : null; // session_id sera une chaîne ou null

  useEffect(() => {
    if (session_id) {
      setLoading(false);
    }
  }, [session_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6 transform animate-fade-in">
        {/* Icon Success */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3 inline-flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-green-500">
          Merci pour votre achat !
        </h1>

        {/* Message */}
        <div className="text-gray-600 space-y-4">
          <p className="text-lg">
            Votre paiement a été traité avec succès. Veuillez nous envoyer un email à{' '}
            <a
              href="mailto:contact@votresite.com"
              className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
            >
              contact@memegeorgette.com
            </a>{' '}
            pour activer votre compte vendeur.
          </p>
        </div>

        {/* Session ID */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">
            Votre numéro de session de paiement est :
          </p>
          <p className="font-mono text-sm break-all bg-white p-3 rounded border border-gray-200">
            {session_id}
          </p>
        </div>

        {/* Button */}
        <div>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg transition-colors duration-200 group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
