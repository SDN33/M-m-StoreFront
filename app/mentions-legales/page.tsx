import React from 'react';

const MentionsLegales: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="max-w-2xl w-full bg-white p-6 sm:p-8 shadow-lg rounded-lg mt-12"> {/* Ajout de mt-12 pour l'espacement en haut */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-primary">Mentions Légales</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
          <p>
            Le site est édité par la société Citoyen du Monde, dont le siège social est situé au 10 allée des Champs-Élysées - 91042 EVRY Cedex.
            <br />
            SAS au capital de 15.000 euros
            <br />
            Siret : 50279488600023
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Hébergement</h2>
          <p>
            L&apos;hébergement du site est assuré par Vercel, situé au 340 S Lemon Ave #4133 Walnut, CA 91789 USA.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur ce site (textes, images, logos, etc.) sont la propriété exclusive de Mémé Georgette, sauf mention contraire.
            <br />
            En accédant et en naviguant sur ce site présenté par Citoyen du Monde, vous êtes informé de vos droits et obligations, et vous acceptez pleinement de vous conformer aux présentes conditions d&apos;utilisation du site.
            <br />
            Ces conditions peuvent être mises à jour depuis votre dernière connexion au site. Vous êtes donc invité à consulter cette page à chaque connexion.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Contact</h2>
          <p>
            Pour toute question, vous pouvez nous contacter par email via notre formulaire de contact.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MentionsLegales;
