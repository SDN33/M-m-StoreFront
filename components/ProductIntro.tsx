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
      className={`flex justify-between items-center mb-2 transition-opacity duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {/* Image de Mémé à gauche */}
      <Image
        src="/images/mémé-georgette1.png"
        alt="Mémé Georgette personnage"
        className="w-28 h-auto border-lg"
        width={112} // Set the width based on the className
        height={120} // Set the height appropriately
      />

      {/* Texte au centre */}
      <div className="text-center" ref={textRef}>
        <h3 className="text-3xl font-extrabold text-orange-400 mt-4 tracking-tight">
          Découvrez notre sélection de vins Bio et Démeter
        </h3>
        <h4 className="text-xl text-gray-700 mt-2 leading-snug font-semibold sloganhero">
          Nous travaillons avec des producteurs locaux et des vignerons engagés pour vous proposer des vins de qualité.
        </h4>
      </div>

      {/* Logo Bio à droite */}
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Agriculture-biologique.svg/langfr-195px-Agriculture-biologique.svg.png"
        alt="Logo Bio"
        className="w-14 h-auto border-lg"
        width={56} // Set the width based on the className
        height={60} // Set the height appropriately
      />
    </div>
  );
};

export default ProductsIntro;
