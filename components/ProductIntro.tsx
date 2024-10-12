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
      <div className="flex items-center space-x-2 text-center md:text-left md:pr-80" ref={textRef}>
        <h3 className="text-2xl md:text-3xl font-extrabold text-orange-500 tracking-tight">
          Découvrez nos vins Bio et Biodynamie
        </h3>
        <Image src="/images/logobio.webp" alt="Logo Bio" width={20} height={20} className='ml-4' />
        <Image src="/images/demeter-logo.png" alt="Logo Demeter" width={30} height={30} />
      </div>
      <br />
      <h4 className="text-sm md:text-sm text-gray-600 mt-2 leading-snug sloganhero font-extrabold">
        En France, la vigne couvre 4% de la surface agricole nationale, mais à elle seule c&apos;est 20% des pesticides. <span className='text-primary'>Luttons contre cela !</span>
      </h4>
    </div>

  );
};

export default ProductsIntro;
