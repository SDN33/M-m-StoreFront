import React from 'react';
import Image from 'next/image';

const Livraison: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 shadow-lg flex flex-col md:flex-row items-center justify-center md:space-x-4">
      {/* Conteneur flex pour le logo et le message de livraison */}
      <div className="flex items-center justify-center md:justify-start">
        {/* Message de livraison */}
        <div className="flex flex-col text-center">
          <h3 className="text-lg md:text-xl font-bold">Livraison sécurisée avec Chronopost</h3>
          <p className="text-sm md:text-base mt-1">
            Nous collaborons avec <span className="font-semibold">Chronopost</span> pour assurer une livraison rapide et sécurisée de vos commandes.
          </p>
        </div>
        {/* Logo Chronopost */}
        <Image
          src="/images/chronopost.png" // Assurez-vous d'avoir le logo Chronopost à cet emplacement
          alt="Logo Chronopost"
          width={100} // Ajustement de la taille
          height={100} // Ajustement de la taille
          className="rounded-lg mr-2" // Ajout d'une marge à droite du logo
          loading="lazy" // Ajout de l'attribut loading pour le chargement paresseux
        />
      </div>
    </div>
  );
};

export default Livraison;
