import React from 'react';

const CGV: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-600 px-4 py-8">
      <br /><br /><br /><br />
      <div className="max-w-2xl w-fit bg-gray-50 p-6 sm:p-8 shadow-lg rounded-lg text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-orange-600">Conditions Générales de Vente (CGV)</h1>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Les présentes conditions générales de vente régissent les relations contractuelles entre l&apos;acheteur et notre société.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Prix</h2>
          <p>
            Tous les prix sont indiqués en euros et incluent la TVA applicable au jour de la commande.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Commandes</h2>
          <p>
            Les commandes sont traitées sous réserve de disponibilité des produits.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Livraison</h2>
          <p>
            La livraison est effectuée à l&apos;adresse indiquée par l&apos;acheteur lors de la commande.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CGV;
