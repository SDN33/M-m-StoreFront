import React from 'react';

const CGV: React.FC = () => {
  return (
    <div className="container text-center mx-auto px-4 min-h-[200vh] mt-16 bg-orange-500 text-white"> {/* Ajout de mt-16 pour l'espacement */}
      <br /><br />
      <br /><br />
      <br /><br />
      <br /><br />
      <h1 className="text-3xl font-bold mb-8">Conditions Générales de Vente (CGV)</h1>
      <br />
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
      <br /><br />
      <br /><br />
    </div>
  );
};

export default CGV;
