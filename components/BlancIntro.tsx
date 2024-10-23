'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // Import the Image component

const BlancIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const introRef = useRef<HTMLDivElement | null>(null);

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

    const currentIntroRef = introRef.current;

    if (currentIntroRef) {
      observer.observe(currentIntroRef);
    }

    return () => {
      if (currentIntroRef) {
        observer.unobserve(currentIntroRef);
      }
    };
  }, []);

  return (
    <div
      ref={introRef}
      className={`flex flex-col md:flex-row justify-between items-center mb-4 ${isVisible ? 'slide-in-visible' : 'slide-in'}`}
    >
      {/* Image de Vin à gauche */}
      <Image
        src="/images/vinentete.svg" // Assure-toi que l'image correspond bien au vin blanc
        alt="Vin Mémé Georgette"
        className="w-30 h-auto border-lg mb-4 md:mb-0 md:ml-24 hidden sm:block md:mt-0"
        width={118} // Set the width based on the className
        height={120} // Set the height appropriately
      />

      {/* Texte au centre avec espacement */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left md:pr-80">
        <h3 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight ml-26">
          Découvrez nos vins <span className='text-yellow-500'>blancs</span> <br /> {/* Change le texte à "blanc" */}
          <div className="text-gray-800 text-sm">* Livraison offerte dès 6 bouteilles achetées sur le même domaine</div>
        </h3>

        {/* Logo Bio Demeter, centré sur mobile et aligné à droite sur desktop */}
        <Image
          src="/images/biodemeter.png"
          alt="Logo Bio Demeter"
          className='sm:pl-10 mx-auto sm:mx-0' // Center on mobile, align left on desktop
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};

export default BlancIntro;
