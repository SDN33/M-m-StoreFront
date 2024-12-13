import React, { useEffect, useState } from 'react';
import { Snowflake, Info, X } from 'lucide-react';

const PromotionSection = () => {
  const [snowflakes, setSnowflakes] = useState<{ left: string; animationDelay: string; opacity: number; size: number }[]>(
    []
  );
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    const generateSnowflakes = () => {
      return [...Array(35)].map(() => ({
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.4 + 0.2,
        size: Math.random() * 20 + 10,
      }));
    };

    setSnowflakes(generateSnowflakes());
  }, []);

  const toggleInfoModal = () => {
    setIsInfoModalOpen(!isInfoModalOpen);
  };

  return (
    <>
      <div
        className="relative overflow-hidden bg-gray-950 text-center shadow-lg w-full z-40 h-16 md:h-8 mb-1 flex items-center justify-center"
      >
        {/* Flocons de neige animés */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {snowflakes.map((flake, index) => (
            <div
              key={index}
              className="absolute snowflake"
              style={{
                left: flake.left,
                animationDelay: flake.animationDelay,
                opacity: flake.opacity,
              }}
            >
              <Snowflake size={flake.size} color="white" className="opacity-30 animate-fall" />
            </div>
          ))}
        </div>

        {/* Texte promotionnel */}
        {/* Version mobile */}
        <div className="sm:hidden text-white text-center w-full font-black">
          Livraison <span className='text-accent'><strong>OFFERTE</strong></span><br />
          <span className='text-xs flex items-center justify-center text-white'>
            &nbsp;en point relais dès 6 bouteilles <br /> d&apos;un même domaine achetés
            <Info
              onClick={toggleInfoModal}
              className="ml-1 w-4 h-4 text-white cursor-pointer inline"
            />
          </span>
        </div>

        {/* Version desktop */}
        <div className="hidden sm:flex items-center justify-center w-full text-white font-black">
          <div>
            <span className='text-base'>Livraison</span>&nbsp;
            <span className='text-accent text-base'>OFFERTE</span>
            <span className='text-xs'>
              &nbsp;en point relais dès 6 bouteilles <span className='text-xs'>d&apos;un même domaine achetés</span>
            </span>
            <Info
              onClick={toggleInfoModal}
              className="ml-1 w-4 h-4 text-white cursor-pointer inline align-text-center"
            />
          </div>
        </div>
      </div>

      {/* Modal d'information */}
      {isInfoModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={toggleInfoModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleInfoModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Détails de la Livraison Gratuite
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Conditions de la promotion :</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Valable uniquement pour les livraisons en point relais</li>
                <li>Offre applicable dès l&apos;achat de 6 bouteilles du même domaine</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                * Offre valable dans la limite des stocks disponibles.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionSection;
