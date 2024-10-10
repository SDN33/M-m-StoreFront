'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // Import the Image component

const ProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const introRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Arrête l'observation une fois visible
        }
      },
      { threshold: 0.1 } // Quand 10% du composant est visible
    );

    const currentIntroRef = introRef.current; // Copy ref value

    if (currentIntroRef) {
      observer.observe(currentIntroRef);
    }

    return () => {
      if (currentIntroRef) {
        observer.unobserve(currentIntroRef);
      }
    };
  }, []);

  useEffect(() => {
    const textObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          textObserver.disconnect(); // Arrête l'observation une fois visible
        }
      },
      { threshold: 0.3 } // Quand 30% du texte est visible
    );

    const currentTextRef = textRef.current; // Copy ref value

    if (currentTextRef) {
      textObserver.observe(currentTextRef);
    }

    return () => {
      if (currentTextRef) {
        textObserver.unobserve(currentTextRef);
      }
    };
  }, []);

  return (
    <div
      ref={introRef}
      className={`flex flex-col md:flex-row justify-between items-center mb-4 transition-opacity duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {/* Image de Mémé à gauche */}
      <Image
        src="/images/mémé-georgette1.png"
        alt="Mémé Georgette personnage"
        className="w-30 h-auto border-lg mb-4 md:mb-0 sm:ml-0 md:ml-24 sm:mt-0 md:mt-0"
        width={112} // Set the width based on the className
        height={120} // Set the height appropriately
      />

      {/* Texte au centre avec espacement */}
      <div className="text-center md:text-left md:pr-40" ref={textRef}>
        <h3 className="text-2xl md:text-3xl font-extrabold text-orange-500 mt-4 tracking-tight">
          Découvrez nos vins Bio et Démeter
        </h3>
        <h4 className="text-lg md:text-xl text-gray-800 mt-2 leading-snug font-semibold sloganhero">
          Nous travaillons avec des producteurs locaux et des vignerons engagés pour la qualité de nos vins.
        </h4>
      </div>

    </div>
  );
};

export default ProductsIntro;
