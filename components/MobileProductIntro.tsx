"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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
      <div className='-mt-10 relative w-full pb-[100%]'> {/* 16:9 aspect ratio container */}
        <video
          src="https://res.cloudinary.com/daroyxenr/video/upload/q_auto:eco/v1732411795/Design_sans_titre_7_1_nobrzq.mp4"
          width={1920}
          height={1080}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover"
          onLoadedData={(e) => {
        const video = e.target as HTMLVideoElement;
        video.play();
        if (typeof caches !== 'undefined') {
          caches.open('video-cache').then(cache => {
            cache.add(video.src);
          });
        }
          }}
        />
      </div>

      <div
        ref={introRef}
        className={`transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } flex flex-col items-center text-center lg:hidden bg-primary py-6 -mt-7 min-h-[300px]`} // Added min-h to prevent shifts
      >
        {/* Logos en haut - Added fixed container */}
        <div className="flex space-x-8 mt-4 h-[35px] items-center">
          <div className="w-[28px] h-[20px] relative">
            <Image
              src="/images/logobio1.webp"
              alt="bio logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <div className="w-[35px] h-[35px] relative">
            <Image
              src="/images/Logobioeu.jpg"
              alt="Bio euro logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <div className="w-[26px] h-[20px] relative">
            <Image
              src="/images/logointro2.jpg"
              alt="nature et progrès"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
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

        {/* Logos en bas - Added fixed container */}
        <div className="flex space-x-8 mt-8 mb-4 h-[35px] items-center">
          <div className="w-[35px] h-[20px] relative">
            <Image
              src="/images/logointro.jpg"
              alt="biodynamie logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <div className="w-[35px] h-[35px] relative">
            <Image
              src="/images/déméter.png"
              alt="demeter logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <div className="w-[35px] h-[20px] relative">
            <Image
              src="/images/biodyvin.jpg"
              alt="biodyvin logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileProductsIntro;
