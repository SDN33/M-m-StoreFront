import { useState, useEffect } from 'react';

const PromotionSection = () => {
  const [isVisible, setIsVisible] = useState(true); // État pour la visibilité

  const handleScroll = () => {
    // Masquer la section si on fait défiler la page
    if (window.scrollY > 0) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    // Ajouter un écouteur d'événements pour le défilement
    window.addEventListener('scroll', handleScroll);

    // Appeler handleScroll pour vérifier la position lors du chargement de la page
    handleScroll();

    // Nettoyer l'écouteur d'événements lors de la destruction du composant
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`bg-white opacity-80 text-center py-4 fixed shadow-sm mt-6 top-20 left-0 w-full z-10 ${isVisible ? 'block' : 'hidden'}`}
      style={{ overflowX: 'hidden' }} // Empêche le défilement horizontal
    >
      <p className="font-extrabold text-xs text-orange-600 sm:text-xs">
        🍇🚚 Livraison offerte dès 6 bouteilles achetées sur un même Domaine 🚚🍇
      </p>
    </div>
  );
};

export default PromotionSection;
