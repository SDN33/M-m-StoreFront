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
    <div ref={introRef} className={`flex flex-col md:flex-row justify-between items-center mb-4 ${isVisible ? 'slide-in-visible' : 'slide-in'}`}>
      {/* Logos à gauche */}
      <div className="space-x-2 slide-in-right hidden md:flex mt-12 ml-28">
        <Image src="/images/logobio1.webp" alt="bio logo" width={30} height={20} className="rounded-lg object-contain" priority={true} />
        <Image src="/images/Logobioeu.jpg" alt="Bio euro logo" width={40} height={40} className="rounded-lg object-contain" priority={true} />
        <Image src="/images/déméter.png" alt="demeter logo" width={40} height={40} className="rounded-lg object-contain" priority={true} />
      </div>

      {/* Texte central avec compteur */}
      <div className="flex flex-col items-center mx-auto mt-28 lg:mt-14 slide-in-right">
        <h1 className="text-lg md:text-3xl font-extrabold text-primary tracking-tight text-center leading-tight">
          {counter.toLocaleString()} vins bio en direct des vignerons(nes)
          <span className="block text-black text-sm ">
            Tu sais, celles et ceux qui respectent la terre, ses locataires...
          </span>
        </h1>
      </div>

      {/* Logos à droite */}
      <div className="space-x-2 slide-in-right hidden md:flex mt-12 mr-28">
        <Image src="/images/logointro.jpg" alt="biodynamie logo" width={40} height={20} className="rounded-lg object-contain" priority={true} />
        <Image src="/images/logointro2.jpg" alt="nature et progrès" width={24} height={20} className="rounded-lg object-contain" priority={true} />
        <Image src="/images/biodyvin.jpg" alt="biodyvin logo" width={50} height={20} className="rounded-lg object-contain" priority={true} />
      </div>
    </div>
  );
};

export default ProductsIntro;
