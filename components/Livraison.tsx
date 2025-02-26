'use client';
import React from 'react';
import Image from 'next/image';

const Livraison: React.FC = () => {
  return (
    <>
      <div className="bg-primary text-white p-6 shadow-lg flex flex-col md:flex-row items-center justify-center md:space-x-4 rounded-xl mx-20 px-10">
        {/* Conteneur flex pour le logo et le message de livraison */}
        <div className="flex items-center justify-center md:justify-start">
          {/* Message de livraison */}
          <div className="flex flex-col text-center">
            <h3 className="text-lg md:text-xl font-bold">Livraison sécurisée en Point Relais ou à Domicile</h3>
            <p className="text-sm md:text-base mt-1">
              Nous collaborons avec <span className="font-semibold">Boxtal</span> pour assurer une livraison rapide et optimale de vos commandes.
            </p>
          </div>
          {/* Logo Chronopost */}
          <img
            src="/images/boxtal.png" // Assurez-vous d'avoir le logo Chronopost à cet emplacement
            alt="Logo Boxtal" // Texte alternatif pour le logo
            width={40} // Ajustement de la taille
            height={40} // Ajustement de la taille
            className="rounded-lg ml-8" // Ajout d'une marge à droite du logo
            loading="lazy" // Ajout de l'attribut loading pour le chargement paresseux
          />
        </div>
      </div>
    </>
  );
};

export default Livraison;
