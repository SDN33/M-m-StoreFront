import React, { useState } from "react";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logique pour gérer l'abonnement
    setEmail("");
    // Vous pouvez ajouter un message de confirmation ici
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mx-auto mt-8 w-full">
      <div className="flex flex-col md:flex-row items-center justify-center">
        {/* Image des verres de vin */}
        <div className="md:w-1/3 h-64 relative">
          <video
            src="/videos/newsletter.mp4"
            className="w-full h-full object-cover border-r-2 border-b-2 border-gray-200"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        {/* Contenu de la newsletter */}
        <div className="md:w-2/3 p-6 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            Newsletter
          </h2>
          <p>Des offres exclusives, des nouveautés...</p>
          <p className="text-primary mb-4">Parole de Mémé, on ne spamme pas.</p>

          <form onSubmit={handleSubscribe} className="mb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="relative flex-grow w-full sm:w-auto">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className='bg-gradient-to-r from-primary to-rose-500 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white py-2 px-4 rounded'
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
