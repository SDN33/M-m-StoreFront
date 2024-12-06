'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollableParent = document.querySelector('main.flex-1');

    const handleScroll = () => {
      if (scrollableParent) {
        const scrollTop = scrollableParent.scrollTop;
        setIsVisible(scrollTop > 100);
      }
    };

    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', handleScroll);
      handleScroll(); // Vérifier la position initiale
    }

    return () => {
      if (scrollableParent) {
        scrollableParent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []); // Pas de dépendances nécessaires car on vise uniquement `main.flex-1`.

  const scrollToTop = () => {
    const scrollableParent = document.querySelector('main.flex-1');
    if (scrollableParent) {
      scrollableParent.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`shadow-2xl fixed bottom-6 right-24 z-[49] flex h-12 w-12 items-center justify-center rounded-full bg-teal-800 text-white transition-opacity duration-300 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 lg:h-14 lg:w-14 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Retour en haut de page"
    >
      <ArrowUp className="h-6 w-6 lg:h-7 lg:w-7" />
    </button>
  );
};

export default BackToTop;
