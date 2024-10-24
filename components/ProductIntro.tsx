'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'; // Import the Image component

const ProductsIntro: React.FC = () => {
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

      {/* Texte au centre avec espacement */}
      <div className="flex mx-auto mt-10 fade-in-up">
        <h3 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight text-center">
          <em>2500 vins <span className='text-green-600'>bio</span></em> en direct des vignerons<span className='text-accent'>(nes)</span>
        <br />
        <div className="text-gray-800 text-sm">Tu sais, celles et ceux qui respectent la terre, ses locataires...</div>
        </h3>
        <br />
        <Image
          src="/images/biodemeter.png"
          alt="bio demeter"
          width={80}
          height={20}
          className="rounded-lg object-contain"
        />
      </div>
    </div>
  );
};

export default ProductsIntro;
