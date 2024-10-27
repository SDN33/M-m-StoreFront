import React from 'react';
import Image from 'next/image';

const MemeGeorgettePremium = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      {/* Caractéristiques */}
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-bounce">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-primary">
              <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zm8-4v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4a1 1 0 011-1h4a1 1 0 011 1z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Livraison en 48H</h3>
          <p className="text-gray-600">Nos vins sont livrable partout en France</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">+ de 2 500 références</h3>
          <p className="text-gray-600">Nous travaillons pour vous proposer le meilleur catalogue de vins bio !</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-bounce">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-primary">
              <path d="M12 15.39l-3.76 2.27.99-4.28-3.32-2.88 4.38-.37L12 6.09l1.71 4.04 4.38.37-3.32 2.88.99 4.28z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Dégustés et approuvés</h3>
          <p className="text-gray-600">Nos vins sont sélectionnés et controler par nos experts</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-primary">
              <path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 16H5V5h14v14z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Emballages</h3>
          <p className="text-gray-600">Chez Mémé, pas de casse ! Nous emballons vos bouteilles avec soin</p>
        </div>
      </div>

      {/* Sections Découvrir */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="relative overflow-hidden rounded-lg group">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            src="/images/meme-pas-contente.png"
            alt="Dégustation"
            className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-500"
            width={800}
            height={400}
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white">
            <Image
              src="/images/memelogo2.png"
              alt="Mémé Georgette"
              className="object-contain -mt-4"
              width={250}
              height={150}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg group">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img
            src="/images/winery.jpg"
            alt="Producteurs"
            className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white">
            <h2 className="text-xl font-bold mb-4">VOUS ÊTES UN PRODUCTEUR ?</h2>
            <a className="bg-white text-gray-800 px-8 py-2 rounded hover:bg-gray-100 transition-colors" href="https://portailpro-memegeorgette.com">
              DÉCOUVRIR NOTRE PORTAIL PRO
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGeorgettePremium;
