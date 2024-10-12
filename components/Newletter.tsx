import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Logique pour gérer l'abonnement

    // Affiche un message de succès
    setIsSubscribed(true);
    setEmail(""); // Réinitialise le champ d'email après l'inscription
  };

  return (
    <div className="bg-gray-100  rounded-md w-[60rem] max-w-full mx-auto text-center ">
      <h2 className="text-xl font-bold mb-8">
        Restez informé des offres de Mémé Georgette !{" "}
        <span className="font-light sloganhero">Promis on ne spamme pas.</span>
      </h2>
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
            className="flex-grow p-2 mb-4 md:mb-0 border border-gray-300 rounded-md md:mr-2 w-full md:w-auto"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white p-2 rounded-md w-full md:w-auto hover:bg-orange-800 transition duration-200"
          >
            S&apos;inscrire
          </button>
        </form>
      )}
        <p className="text-sm font-light mt-6">
          Nous avons à cœur de partager notre passion pour les vins bio et biodynamiques. <br />
          Notre cave coopérative s&apos;engage à proposer des vins authentiques,
          en privilégiant les circuits courts et le respect de la nature.
        </p>
    </div>
  );
};

export default Newsletter;
