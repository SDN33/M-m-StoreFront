import React, { useState } from "react";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique pour gérer l'abonnement
    setEmail("");
    // Ici, vous pourriez ajouter une logique pour afficher un message de confirmation
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Image des verres de vin */}
        <div className="md:w-1/4 md:h-1/2 relative h-64">
          <video
            src="/images/newsletter.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
          />
        </div>

        {/* Contenu de la newsletter */}
        <div className="md:w-1/2 p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            Restez informé des offres de Mémé Georgette !
          </h2>
          <p className="text-orange-500 mb-4">Parole de mémé, on ne spamme pas.</p>

          <form onSubmit={handleSubscribe} className="mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                S&apos;inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
