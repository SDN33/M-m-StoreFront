'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const slogans = [
  "À une époque de supercherie alimentaire,<br />boire un vin bio est un acte révolutionnaire !",
  "Le vin bio, un choix pour la terre.",
  "Biodynamie = un respect profond de la nature.",
  "Soutenir les vignerons, c'est préserver notre avenir.",
  "Des vignes cultivées sans chimie,<br />pour un goût authentique.",
];

const HeroBanner = () => {
  const [videoError, setVideoError] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan(prev => (prev + 1) % slogans.length);
    }, 5000); // Change de slogan toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-screen">
      {/* Vidéo pour mobile */}
      <video
        className={`absolute inset-0 w-full h-full object-cover md:hidden ${videoError ? 'hidden' : ''}`}
        autoPlay
        loop
        muted
        playsInline // Ajout de l'attribut playsInline pour iPhone
        onError={() => setVideoError(true)} // Affiche l'image de fond si la vidéo ne se charge pas
      >
        <source src="/videos/herobanner-mobile.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>

      {/* Image de fond pour mobile si la vidéo ne se charge pas */}
      {videoError && (
        <div
          className="absolute inset-0 bg-cover z-0"
          style={{
            backgroundImage: "url('/images/banner.svg'), radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))",
            backgroundBlendMode: 'multiply',
          }}
        ></div>
      )}

      {/* Image de fond pour écrans plus grands */}
      <div
        className="absolute inset-0 bg-cover hidden md:block z-0"
        style={{
          backgroundImage: "url('/images/banner.svg'), radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))",
          backgroundBlendMode: 'multiply',
        }}
      ></div>

      {/* Conteneur avec z-10 pour rester au-dessus de l'image de fond */}
      <div className="md:mt-20 mt-40 space-y-3 md:space-y-0 flex flex-col items-center text-center z-10 text-white relative">
        <p className="text-white text-xl md:text-3xl font-semibold sloganhero">
          CAVE COOPÉRATIVE ENGAGÉE
          <br /><span className='text-xl md:text-3xl font-semibold sloganhero text-primary'>En direct des vignerons(nes)</span>
        </p>
        <br />
        {/* Logos pour web */}
        <div className="hidden sm:flex items-center justify-center gap-4">
          <Image src="/images/logobio.webp" alt="Logo Bio" width={25} height={25} />
          <Image src="/images/demeter-logo.png" alt="Logo Demeter" width={65} height={95} />
        </div>

        <div>
          {/* Titre avec slogans */}
          <h1 className="text-4xl md:text-4xl leading-tight font-black hidden md:block">
            <br />
            <span className="block fade-in" dangerouslySetInnerHTML={{ __html: slogans[currentSlogan] }} />
            <p className="text-lg mt-4 md:text-xl font-light">- Mémé Georgette</p>
          </h1>
          {/* Titre pour mobile */}
          <h1 className="text-2xl md:text-4xl leading-tight font-black block md:hidden">
            <br />
            <span className="block fade-in" dangerouslySetInnerHTML={{ __html: slogans[currentSlogan] }} />
            <p className="text-lg mt-4 md:text-xl font-light">- Mémé Georgette</p>
          </h1>
        </div>
      </div>

      {/* Boutons alignés en bas uniquement pour mobile */}
      <div className="flex flex-col items-center gap-3 justify-center mb-4 z-10 md:hidden pt-10">
        <button className="shadow-lg bg-orange-600 text-white px-6 py-3 rounded-full font-medium flex items-center hover:bg-orange-800 hover:text-white transition-colors text-sm">
          Notre Cave
          <span className="ml-2">➜</span>
        </button>

        <a
          href="https://www.memegeorgette.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Découvrir Mémé Georgette - Accédez à notre site pour explorer notre sélection de vins bio"
        >
          <button className="flex items-center gap-2 px-4 py-3 bg-white border-b-2 border-black text-gray-800 rounded-full font-semibold hover:bg-gray-500 hover:text-white transition-colors text-sm">
            <Play className="w-3 h-3" />
            Découvrir Mémé Georgette
          </button>
        </a>
      </div>

      {/* Les boutons pour la version ordinateur */}
      <div className="hidden md:flex items-center gap-3 justify-center mt-12 z-10">
        <button className="shadow-lg bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium flex items-center hover:bg-orange-800 hover:text-white transition-colors text-sm md:text-base">
          Notre Cave
          <span className="ml-2">➜</span>
        </button>

        <a
          href="https://www.memegeorgette.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Découvrir le site officiel de Mémé Georgette"
        >
          <button className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-white border-b-2 border-black text-gray-900 rounded-full font-semibold hover:bg-gray-500 hover:text-white transition-colors text-sm md:text-base">
            <Play className="w-3 h-3 md:w-4 md:h-4" />
            Découvrir Mémé Georgette
          </button>
        </a>
      </div>
    </div>
  );
};

export default HeroBanner;
