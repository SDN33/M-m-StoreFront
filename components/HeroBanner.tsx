'use client';

import { Play } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
      <div
        className="absolute inset-0 bg-cover md:bg-left z-0"
        style={{
          backgroundImage: "url('/images/banner.svg'), radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))",
          backgroundBlendMode: 'multiply',
        }}
      ></div>

      {/* Conteneur avec z-10 pour rester au-dessus de l'image de fond */}
      <div className="mt-10 space-y-4 md:space-y-6 flex flex-col items-center text-center z-10 text-white relative"> {/* Animation légère ajoutée */}
        <p className="text-white text-lg md:text-2xl font-semibold sloganhero"> {/* Ajustement des tailles pour mobile */}
          CAVE COOPÉRATIVE ENGAGÉE
        </p>

        <div>
          <h1 className="text-4xl md:text-5xl leading-tight font-black sloganhero"> {/* Texte plus petit sur mobile */}
            Vins bio et démeter
            <br />Clair, cash et sans compromis sur la terre
          </h1>
        </div>
        <br /><br />
        <div className="flex items-center gap-3 md:gap-4 justify-center mt-8 md:mt-14"> {/* Réduction de l'espacement pour mobile */}
          <button className="shadow-lg bg-orange-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium flex items-center hover:bg-orange-800 hover:text-white transition-colors text-sm md:text-base"> {/* Bouton plus petit avec plus de padding sur mobile */}
            Notre Cave
            <span className="ml-2">➜</span>
          </button>

          <button className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-white border-b-2 border-black text-gray-800 rounded-full font-semibold hover:bg-gray-500 hover:text-white transition-colors text-sm md:text-base"> {/* Bouton plus petit avec plus de padding sur mobile */}
            <Play className="w-3 h-3 md:w-4 md:h-4" />
            Découvrir Mémé Georgette
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
