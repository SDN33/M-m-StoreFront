import React from 'react';

const MentionsLegales: React.FC = () => {
  return (
    <div className="container text-center mx-auto px-4 min-h-[200vh] pt-24 bg-orange-500 text-white"> {/* Ajout de pt-24 pour l'espacement */}
      <br /><br />
      <br /><br />
      <br /><br />
      <br /><br />
      <h1 className="text-3xl font-bold mb-8 text-white">Mentions Légales</h1>
      <br />
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">1. Éditeur du site</h2>
        <p>
          Le site est édité par la société Citoyen du Monde,<br />dont le siège social est situé au 10 allée des champs Elysées - 91042 EVRY Cedex.
          <br />SAS au capital de 15.000 euros
          <br />Siret : 50279488600023


        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">2. Hébergement</h2>
        <p>
          L'hébergement du site est assuré par Vercel, situé au 340 S Lemon Ave #4133 Walnut, CA 91789 USA.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">3. Propriété intellectuelle</h2>
        <p>
          Tous les contenus présents sur ce site (textes, images, logos, etc.) sont la propriété exclusive de Mémé Georgette, sauf mention contraire.
          <br />En accédant et en navigant sur ce site présenté par Citoyen du Monde, vous êtes informé de vos droits et obligations
          <br />et vous acceptez pleinement de vous conformer aux présentes conditions d’utilisation du site.
          <br />Ces conditions peuvent être mises à jour depuis votre dernière connexion au site. Vous êtes donc invité à consulter cette page à l’occasion de chaque connexion au site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">4. Contact</h2>
        <p>
          Pour toute question, vous pouvez nous contacter par email à via notre formulaire de contact.
        </p>
      </section>
      <br /><br />
      <br /><br />
    </div>
  );
};

export default MentionsLegales;
