import React from 'react';
import Image from 'next/image';

const Livraison: React.FC = () => {
  return (
    <div className="bg-black text-white p-2 shadow-md flex items-center justify-center space-x-4">
      {/* Logo UPS */}
      <a href="https://www.ups.com" target="_blank" rel="noopener noreferrer">
        <Image
          src="/images/ups.png"
          alt="UPS Logo"
          width={100}
          height={50}
        />
      </a>

      {/* Message de livraison */}
      <div className="flex flex-col text-center">
        <h3 className="text-lg font-semibold mb-2">
          Livraison sécurisée avec UPS
        </h3>
        <p className="text-sm">
          Nous collaborons avec <span className="font-bold">UPS</span> pour assurer une livraison rapide et sécurisée de vos commandes.
        </p>
      </div>
    </div>
  );
};

export default Livraison;
