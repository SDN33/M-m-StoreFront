'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const ProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter, setCounter] = useState(0); // État pour le compteur
  const introRef = useRef<HTMLDivElement | null>(null);
  const targetCount = 2500; // Nombre total de produits

  useEffect(() => {
    // Intersection observer pour détecter la visibilité du composant
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Arrêter l'observation une fois visible
        }
      },
      { threshold: 0.1 } // Déclenchement lorsque 10% du composant est visible
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

  // Effet pour animer le compteur
  useEffect(() => {
    if (isVisible && counter < targetCount) {
      const interval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter < targetCount) {
            return prevCounter + 50; // Ajuster la vitesse d'incrémentation ici
          } else {
            clearInterval(interval);
            return targetCount; // Assurer que le compteur atteigne la valeur cible
          }
        });
      }, 50); // Mise à jour toutes les 50ms pour une animation fluide

      return () => clearInterval(interval);
    }
  }, [isVisible, counter, targetCount]);

  return (
    <div
      ref={introRef}
      className={`flex flex-col md:flex-row justify-between items-center mb-4 ${isVisible ? 'slide-in-visible' : 'slide-in'}`}
    >
      {/* Texte au centre avec espacement */}
      <div className="flex mx-auto mt-28 lg:mt-16 slide-in-right">
        <h1 className="text-lg md:text-3xl font-extrabold text-primary tracking-tight text-center">
          {counter.toLocaleString()} vins bio en direct des vignerons<span className="text-sm ">(nes)</span>
          <br />
          <div className="text-black text-sm">
            Tu sais, celles et ceux qui respectent la terre, ses locataires...
          </div>
        </h1>
        <br />
        <Image
          src="/images/biodemeter.png"
          alt="bio demeter"
          width={80}
          height={20}
          className="rounded-lg object-contain ml-2 hidden md:block"
        />
      </div>
      <Image
          src="/images/biodemeter.png"
          alt="bio demeter"
          width={80}
          height={20}
          className="rounded-lg object-contain ml-2 mt-2 md:hidden -mb-10"
        />
    </div>
  );
};

export default ProductsIntro;
