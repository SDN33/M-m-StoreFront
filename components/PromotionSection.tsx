import { useState, useEffect } from 'react';

const PromotionSection = () => {
  const [isVisible, setIsVisible] = useState(false); // Commence par être caché

  const handleScroll = () => {
    // Affiche le banner uniquement si on est en haut de la page
    if (window.scrollY === 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Vérifie la position initiale lors du chargement
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`opacity-90 text-center   shadow-sm  w-full z-10 ${isVisible ? 'block' : 'hidden'}`}
    >
      <p className="font-extrabold bg-black shadow-sm text-white text-xs sm:text-xs lg:text-sm">
        <span className="sm:hidden">
        Livraison <span className='text-accent'>OFFERTE* 🎉</span><br /><span className='text-xs'>Dès 6 bouteilles achetées sur un même domaine</span>
        </span>

        {/* Affichage sur plus grand écran sans saut de ligne */}
        <span className=" hidden sm:inline text-base fade-in-up ">
        Livraison <span className='text-accent'>OFFERTE* 🎉</span><span className='text-xs'> Dès 6 bouteilles achetées sur un même domaine</span>
        </span>
      </p>
    </div>
  );
};

export default PromotionSection;
