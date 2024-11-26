'use client';

import React, { useState } from 'react';

const faqData = [
  {
    question: "Comment passer une commande sur la marketplace ?",
    answer: "Pour passer une commande, connectez-vous à votre compte, parcourez notre sélection de vins, ajoutez les produits à votre panier et validez la commande. Vous recevrez un email de confirmation une fois la commande validée.",
  },
  {
    question: "Quels sont les frais de livraison pour les commandes de vins ?",
    answer: "Les frais de livraison varient en fonction du nombre de bouteilles commandées et de votre région de livraison. Les détails apparaîtront lors de la validation de votre commande.",
  },
  {
    question: "Comment puis-je suivre ma commande de vin ?",
    answer: "Une fois votre commande expédiée, un email contenant un lien de suivi vous sera envoyé. Vous pouvez également suivre l'état de votre commande dans la section 'Mes commandes' de votre compte.",
  },
  {
    question: "Puis-je retourner une bouteille de vin ?",
    answer: "Nous acceptons les retours sous certaines conditions. Contactez notre service client pour discuter des détails et obtenir une étiquette de retour si votre produit est éligible.",
  },
  {
    question: "Comment modifier mon adresse de livraison après avoir passé une commande ?",
    answer: "Si votre commande n'a pas encore été expédiée, vous pouvez modifier votre adresse de livraison en contactant notre service client. Une fois la commande expédiée, les modifications ne seront plus possibles.",
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Nous acceptons les paiements par carte bancaire, PayPal et virement bancaire. Toutes les transactions sont sécurisées.",
  },
  {
    question: "Puis-je bénéficier d'une réduction pour des commandes en gros ?",
    answer: "Oui, nous proposons des réductions pour les commandes importantes. Contactez notre service client pour en savoir plus sur nos offres pour les grandes commandes.",
  },
  {
    question: "Les vins proposés sont-ils tous certifiés bio ?",
    answer: "Oui, tous les vins proposés sur notre marketplace sont certifiés bio, et beaucoup d'entre eux sont également certifiés Demeter. Nous nous engageons à ne proposer que des produits de haute qualité, respectueux de l'environnement.",
  },
  {
    question: "Quels sont les délais de livraison pour ma commande de vin ?",
    answer: "Les délais de livraison varient selon la région, mais en général, vous recevrez vos vins sous 3 à 7 jours ouvrables après validation de la commande.",
  },
  {
    question: "Comment puis-je contacter le service client ?",
    answer: "Vous pouvez nous contacter via le formulaire de contact sur notre site, par email ou par téléphone. Nos coordonnées sont disponibles dans la section 'Contact'.",
  },
  {
    question: "Puis-je annuler ma commande ?",
    answer: "L'annulation est possible tant que votre commande n'a pas encore été expédiée. Pour annuler, connectez-vous à votre compte ou contactez notre service client au plus vite.",
  },
  {
    question: "Est-ce que ma commande est assurée en cas de perte ou de casse ?",
    answer: "Oui, toutes nos commandes sont assurées. En cas de problème, contactez notre service client pour une assistance rapide.",
  },
  {
    question: "Quels sont les avantages de créer un compte sur la marketplace ?",
    answer: "Créer un compte vous permet de suivre vos commandes, de conserver vos adresses de livraison et de bénéficier d'offres exclusives réservées aux membres.",
  },
  {
    question: "Proposez-vous des cartes cadeaux ?",
    answer: "Oui, nous proposons des cartes cadeaux numériques que vous pouvez personnaliser et offrir à vos proches.",
  },
  {
    question: "Que faire si je reçois une bouteille endommagée ?",
    answer: "Si une bouteille arrive endommagée, contactez notre service client avec des photos comme preuve, et nous organiserons un remplacement ou un remboursement.",
  },
  {
    question: "Quels sont vos horaires d'ouverture pour le service client ?",
    answer: "Notre service client est disponible du lundi au vendredi de 9h à 18h. Vous pouvez également nous envoyer un email en dehors de ces horaires.",
  },
  {
    question: "Puis-je cumuler des codes promo ?",
    answer: "Non, un seul code promo peut être utilisé par commande, sauf indication contraire dans les conditions de l'offre.",
  },
  {
    question: "Est-il possible d'acheter du vin directement chez un vigneron ?",
    answer: "Oui, nous proposons une sélection de produits disponibles directement auprès de nos vignerons partenaires. Consultez les informations sur chaque produit pour en savoir plus.",
  },
  {
    question: "Comment puis-je m'abonner à la newsletter ?",
    answer: "Pour vous abonner, entrez votre adresse email dans le champ prévu à cet effet sur notre site. Vous recevrez des informations sur nos nouveautés et nos promotions exclusives.",
  },
];

export default function Faq() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="w-full pb-8 mb-28 mt-40">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-16">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Foire Aux Questions (FAQ)
            </h1>

            {/* Champ de recherche */}
            <div className="mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Recherchez une question..."
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Liste des questions/réponses */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg shadow-sm">
                    {/* Question */}
                    <button
                      onClick={() => toggleQuestion(index)}
                      aria-expanded={activeQuestion === index}
                      className="w-full text-left px-4 py-3 font-medium bg-gray-100 hover:bg-gray-200 transition"
                    >
                      {faq.question}
                    </button>

                    {/* Réponse */}
                    {activeQuestion === index && (
                      <div className="p-4 text-gray-700 bg-white border-t">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-600">
                  Aucune question ne correspond à votre recherche.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
