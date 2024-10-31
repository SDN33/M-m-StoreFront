'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const MobileProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const introRef = useRef<HTMLDivElement | null>(null);
  const targetCount = 2500;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
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

  useEffect(() => {
    if (isVisible && counter < targetCount) {
      const interval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter < targetCount) {
            return prevCounter + 50;
          } else {
            clearInterval(interval);
            return targetCount;
          }
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isVisible, counter, targetCount]);

  return (
    <div
      ref={introRef}
      className="flex flex-col items-center text-center mb-4 md:hidden"
    >
      {/* Logos en haut pour la version mobile */}
      <div className="flex space-x-2 mt-4">
        <Image src="/images/logobio1.webp" alt="bio logo" width={30} height={20} className="object-contain" priority={true} />
        <Image src="/images/Logobioeu.jpg" alt="Bio euro logo" width={35} height={35} className="object-contain" priority={true} />
        <Image src="/images/déméter.png" alt="demeter logo" width={35} height={35} className="object-contain" priority={true} />
      </div>

      {/* Texte central avec compteur */}
      <div className="flex flex-col items-center mx-auto mt-4 slide-in-right">
        <h1 className="text-lg font-extrabold text-primary tracking-tight text-center leading-tight">
          {counter.toLocaleString()} vins bio en direct des vignerons(nes)
          <span className="block text-black text-xs">
            Tu sais, celles et ceux qui respectent la terre, ses locataires...
          </span>
        </h1>
      </div>

      {/* Logos en bas pour la version mobile */}
      <div className="flex space-x-2 mt-4">
        <Image src="/images/logointro.jpg" alt="biodynamie logo" width={35} height={20} className="object-contain" priority={true} />
        <Image src="/images/logointro2.jpg" alt="nature et progrès" width={30} height={20} className="object-contain" priority={true} />
        <Image src="/images/biodyvin.jpg" alt="biodyvin logo" width={35} height={20} className="object-contain" priority={true} />
      </div>
    </div>
  );
};

export default MobileProductsIntro;
