'use client';
import React, { useState } from 'react';

const faqData = [
  {
    question: "Comment passer une commande sur la marketplace ?",
    answer: "Pour passer une commande, connectez-vous à votre compte, parcourez notre sélection de vins, ajoutez les produits à votre panier et validez la commande. Vous recevrez un email de confirmation une fois la commande validée."
  },
  {
    question: "Quels sont les frais de livraison pour les commandes de vins ?",
    answer: "Les frais de livraison varient en fonction du nombre de bouteilles commandées et de votre région de livraison. Les détails apparaîtront lors de la validation de votre commande."
  },
  {
    question: "Comment puis-je suivre ma commande de vin ?",
    answer: "Une fois votre commande expédiée, un email contenant un lien de suivi vous sera envoyé. Vous pouvez également suivre l'état de votre commande dans la section 'Mes commandes' de votre compte."
  },
  {
    question: "Puis-je retourner une bouteille de vin ?",
    answer: "Nous acceptons les retours sous certaines conditions. Contactez notre service client pour discuter des détails et obtenir une étiquette de retour si votre produit est éligible."
  },
  {
    question: "Comment modifier mon adresse de livraison après avoir passé une commande ?",
    answer: "Si votre commande n'a pas encore été expédiée, vous pouvez modifier votre adresse de livraison en contactant notre service client. Une fois la commande expédiée, les modifications ne seront plus possibles."
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Nous acceptons les paiements par carte bancaire, PayPal et virement bancaire. Toutes les transactions sont sécurisées."
  },
  {
    question: "Puis-je bénéficier d'une réduction pour des commandes en gros ?",
    answer: "Oui, nous proposons des réductions pour les commandes importantes. Contactez notre service client pour en savoir plus sur nos offres pour les grandes commandes."
  },
  {
    question: "Les vins proposés sont-ils tous certifiés bio ?",
    answer: "Oui, tous les vins proposés sur notre marketplace sont certifiés bio, et beaucoup d'entre eux sont également certifiés Demeter. Nous nous engageons à ne proposer que des produits de haute qualité, respectueux de l'environnement."
  },
  {
    question: "Quels sont les délais de livraison pour ma commande de vin ?",
    answer: "Les délais de livraison varient selon la région, mais en général, vous recevrez vos vins sous 3 à 7 jours ouvrables après validation de la commande."
  },
  {
    question: "Comment puis-je contacter le service client ?",
    answer: "Vous pouvez nous contacter via le formulaire de contact sur notre site, par email ou par téléphone. Nos coordonnées sont disponibles dans la section 'Contact'."
  },
  {
    question: "Puis-je annuler ma commande ?",
    answer: "L'annulation est possible tant que votre commande n'a pas encore été expédiée. Pour annuler, connectez-vous à votre compte ou contactez notre service client au plus vite."
  },
];

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState<string>(''); // État pour la recherche
  const [filteredAnswer, setFilteredAnswer] = useState<string | null>(null); // Réponse filtrée

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    // Recherche de la réponse qui correspond à la question
    const foundFaq = faqData.find(faq =>
      faq.question.toLowerCase().includes(query)
    );

    if (foundFaq) {
      setFilteredAnswer(foundFaq.answer);
    } else {
      setFilteredAnswer("Aucune réponse trouvée pour cette question.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-600 px-4">
      <div className="max-w-md w-full bg-gray-100 p-6 sm:p-8 shadow-lg rounded-lg mt-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-orange-600">Foire Aux Questions (FAQ)</h1>

        {/* Input de recherche */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Entrez votre question..."
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
        />

        {/* Affichage de la réponse filtrée */}
        <div className="mt-4">
          {filteredAnswer ? (
            <p className="text-gray-700 text-base leading-relaxed">{filteredAnswer}</p>
          ) : (
            <p className="text-gray-500">Veuillez entrer une question dans le champ ci-dessus.</p>
          )}
        </div>

        {/* Liste des FAQ pour un aperçu */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Questions fréquentes :</h2>
          <ul className="list-disc list-inside text-gray-700">
            {faqData.slice(0, 4).map((faq, index) => (
              <li key={index} className="mb-2">{faq.question}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
