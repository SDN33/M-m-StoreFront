import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vous pouvez ajouter ici la logique pour gérer l'abonnement,
    // comme un appel API pour sauvegarder l'email

    // Affiche un message de succès
    setIsSubscribed(true);
    setEmail(""); // Réinitialise le champ d'email après l'inscription
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md w-[60rem] mx-auto text-center mt-4">
      <h2 className="text-xl font-bold mb-8 sloganhero">
        Restez informé des offres de Mémé Georgette ! <span className="font-light">Promis on ne spamme pas.</span>
      </h2>
      <br />
      {isSubscribed ? (
        <p className="text-green-600">Merci pour votre inscription !</p>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row">
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-800 transition duration-200"
          >
            S&apos;inscrire
          </button>
        </form>
      )}
    </div>
  );
};

export default Newsletter;
