"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {MoveVertical} from 'lucide-react';

const MobileProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const introRef = useRef<HTMLDivElement | null>(null);
  const targetCount = 2500;

  // Observer pour détecter l'élément visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Arrêter l'observation après le déclenchement
        }
      },
      { threshold: 0.1 } // L'élément doit être visible à 10% pour déclencher
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

  // Animation du compteur
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
    <>
      <div className='-mt-10'>
        <video
          src="/videos/bannermobile.mp4"
          width={1920}
          height={1080}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Indicateur scroll */}
      <div className="scroll-animation flex justify-center">
        <div className="w-6 h-6 rounded-full bg-white animate-scroll"><MoveVertical /></div>
        <style jsx>{`
          @keyframes scroll {
            0%, 100% {
              transform: translateY(-30px);
            }
            50% {
              transform: translateY(0px);
            }
          }
          .animate-scroll {
            animation: scroll 1.5s infinite ease-in-out;
            bg-opacity: 0.5;
          }
        `}</style>
      </div>
      <div
        ref={introRef}
        className={`transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } flex flex-col items-center text-center md:hidden bg-primary py-6 -mt-7`}
      >
        {/* Logos en haut */}
        <div className="flex space-x-8 mt-4">
          <Image
            src="/images/logobio1.webp"
            alt="bio logo"
            width={28}
            height={20}
            className="object-contain"
            priority={true}
          />
          <Image
            src="/images/Logobioeu.jpg"
            alt="Bio euro logo"
            width={35}
            height={35}
            className="object-contain"
            priority={true}
          />
          <Image
            src="/images/logointro2.jpg"
            alt="nature et progrès"
            width={26}
            height={20}
            className="object-contain"
            priority={true}
          />
        </div>

        {/* Texte central avec compteur */}
        <div className="flex flex-col items-center mx-auto mt-6 slide-in-right">
          <h1 className="text-2xl font-extrabold text-white tracking-tight text-center leading-tight">
            {counter.toLocaleString()} vins bio <br />
            en direct des vignerons(nes)
            <span className="block text-white text-xs">
              Tu sais, celles et ceux qui respectent la terre, ses locataires...
            </span>
          </h1>
        </div>

        {/* Logos en bas */}
        <div className="flex space-x-8 mt-8 mb-4">
          <Image
            src="/images/logointro.jpg"
            alt="biodynamie logo"
            width={35}
            height={20}
            className="object-contain"
            priority={true}
          />
          <Image
            src="/images/déméter.png"
            alt="demeter logo"
            width={35}
            height={35}
            className="object-contain"
            priority={true}
          />
          <Image
            src="/images/biodyvin.jpg"
            alt="biodyvin logo"
            width={35}
            height={20}
            className="object-contain"
            priority={true}
          />
        </div>
      </div>
    </>
  );
};

export default MobileProductsIntro;
