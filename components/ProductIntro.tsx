'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const ProductsIntro: React.FC = () => {
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
      className={`relative overflow-hidden bg-white py-8 px-4 md:px-8 rounded-3xl shadow-lg text-center pt-24 ${
        isVisible ? 'slide-in-visible' : 'slide-in'
      }`}
    >
      <div className="relative z-10 flex flex-col md:flex-row justify-center items-center">
        {/* Logos à gauche et à droite */}
        <div className="space-x-2 hidden lg:flex mb-4 md:mb-0 md:mr-8 lg:mr-16 slide-in-right">
          <Image src="/images/logobio1.webp" alt="bio logo" width={40} height={30} className="object-contain" priority={true} />
          <Image src="/images/Logobioeu.jpg" alt="Bio euro logo" width={50} height={50} className="object-contain" priority={true} />
          <Image src="/images/déméter.png" alt="demeter logo" width={50} height={50} className="object-contain" priority={true} />
        </div>

        {/* Texte central avec compteur */}
        <div className="flex flex-col items-center mx-auto slide-in-right">
          <h1 className="text-base md:text-3xl font-extrabold text-primary tracking-tight text-center leading-tight">
            <span className="font-['Orbitron'] text-2xl md:text-3xl">
              {counter.toLocaleString()}
            </span>{' '}
            vins bio en direct des vignerons(nes)
            <span className="block text-black text-xs md:text-sm font-['Inter'] mt-2">
              Tu sais, celles et ceux qui respectent la terre, ses locataires...
            </span>
          </h1>
        </div>

        {/* Logos à droite */}
        <div className="space-x-2 hidden lg:flex mb-4 md:mb-0 md:ml-8 lg:ml-16 slide-in-right">
          <Image src="/images/logointro.jpg" alt="biodynamie logo" width={50} height={30} className="object-contain" priority={true} />
          <Image src="/images/logointro2.jpg" alt="nature et progrès" width={40} height={30} className="object-contain" priority={true} />
          <Image src="/images/biodyvin.jpg" alt="biodyvin logo" width={60} height={30} className="object-contain" priority={true} />
        </div>
      </div>
    </div>
  );
};

export default ProductsIntro;
