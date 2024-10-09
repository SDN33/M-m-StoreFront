// ProductsIntro.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

const ProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
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

    if (introRef.current) {
      observer.observe(introRef.current);
    }

    return () => {
      if (introRef.current) {
        observer.unobserve(introRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const textObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTextVisible(true);
          textObserver.disconnect(); // Arrête l'observation une fois visible
        }
      },
      { threshold: 0.3 } // Quand 10% du texte est visible
    );

    if (textRef.current) {
      textObserver.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        textObserver.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={introRef}
      className={`flex justify-between items-center mb-2 transition-opacity duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {/* Image de Mémé à gauche */}
      <img
        src="/images/mémé-georgette1.png"
        alt="Mémé Georgette personnage"
        className="w-28 h-auto border-lg"
      />

      {/* Texte au centre */}
      <div className="text-center">
        <h3 className="text-3xl font-extrabold text-orange-500 mt-4 tracking-tight">
          Découvrez notre sélection de vins Bio et Démeter
        </h3>
        <h4 className="text-xl text-gray-700 mt-2 leading-snug font-semibold sloganhero">
          Nous travaillons avec des producteurs locaux et des vignerons engagés pour vous proposer des vins de qualité.
        </h4>
      </div>

      {/* Logo Bio à droite */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Agriculture-biologique.svg/langfr-195px-Agriculture-biologique.svg.png"
        alt="Logo Bio"
        className="w-14 h-auto border-lg"
      />
    </div>
  );
};

export default ProductsIntro;
