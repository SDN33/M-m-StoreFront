import React, { useEffect, useState } from 'react';
import { Snowflake } from 'lucide-react';

const PromotionSection = () => {
  const [snowflakes, setSnowflakes] = useState<{ left: string; animationDelay: string; opacity: number; size: number }[]>(
    []
  );

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

  return (
    <div
      className="relative overflow-hidden bg-black text-center shadow-lg w-full z-40 py-2 h-16 md:h-8 mb-1"
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
      <p className="relative z-10 font-extrabold text-white text-xs sm:text-sm h-fit -mt-1">
        <span className="sm:hidden">
          Livraison <span className='text-accent'><strong>OFFERTE</strong></span><br />
          <span className='text-xs'>
            &nbsp;en point relais dès 6 bouteilles <br /> d&apos;un même domaine achetés
          </span>
        </span>

        <span className="hidden sm:inline text-xs fade-in-up">
          <span className='text-base'>Livraison</span>&nbsp;<span className='text-accent text-base'>OFFERTE</span>
          <span className='text-xs'>
            &nbsp;en point relais dès 6 bouteilles <span className='text-xs'>d&apos;un même domaine achetés</span>
          </span>
        </span>
      </p>
    </div>
  );
};

export default PromotionSection;
