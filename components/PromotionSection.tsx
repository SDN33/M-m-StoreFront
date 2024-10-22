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
      className={`bg-gray-100 opacity-80 text-center py-4 fixed shadow-sm mt-6 top-20 left-0 w-full z-10 ${isVisible ? 'block' : 'hidden'}`}
    >
      <p className="font-extrabold text-orange-600 text-xs sm:text-xs lg:text-sm">
        {/* Affichage sur mobile avec emojis */}
        <span className="sm:hidden">
          🍇🚚 Livraison offerte 🚚🍇<br /> Dès 6 bouteilles achetées sur un même Domaine
        </span>

        {/* Affichage sur plus grand écran sans saut de ligne */}
        <span className="hidden sm:inline text-base">
          🍇🚚 Livraison offerte dès 6 bouteilles achetées sur un même Domaine 🚚🍇
        </span>
      </p>
    </div>
  );
};

export default PromotionSection;
