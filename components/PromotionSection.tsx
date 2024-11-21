import React from 'react';
import { Gift, Snowflake, TreePine as ChristmasTree } from 'lucide-react';

const PromotionSection = () => {
  React.useEffect(() => {
    const handleScroll = () => {
      const promotionSection = document.querySelector('.promotion-section');
      if (promotionSection) {
        if (window.scrollY > 50) {
          promotionSection.classList.add('hidden');
        } else {
          promotionSection.classList.remove('hidden');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-black text-center shadow-lg w-full z-40 py-2 h-16 md:h-8 mb-1 promotion-section`}
    >
      {/* Flocons de neige animés */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className="absolute snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7
            }}
          >
            <Snowflake
              size={Math.random() * 20 + 10}
              color="white"
              className="opacity-30 animate-fall"
            />
          </div>
        ))}
      </div>

      {/* Éléments décoratifs de Noël */}
      <div className="absolute left-4 top-0 text-white opacity-50">
        <ChristmasTree size={30} />
      </div>

      <div className="absolute right-4 top-0 text-white opacity-50">
        <Gift
          size={30}
          className="animate-bounce"
        />
      </div>

      <p className="relative z-10 font-extrabold text-white text-xs sm:text-sm lg:text-sm h-fit">
        <span className="sm:hidden">
          Livraison <span className='text-accent'>OFFERTE</span><br />
          <span className='text-xs'>&nbsp;en point relais dès 6 bouteilles <br /> d&apos;un même domaine achetés</span>
        </span>

        <span className="hidden sm:inline text-base fade-in-up">
          Livraison <span className='text-accent'>OFFERTE</span>
          <span className='text-xs'>&nbsp;en point relais dès 6 bouteilles <span className='text-xs'>d&apos;un même domaine achetés</span></span>
        </span>
      </p>
    </div>
  );
};

export default PromotionSection;
