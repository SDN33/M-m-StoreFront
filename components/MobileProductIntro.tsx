"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MobileSlider from './MobileSlider';

const MobileProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const introRef = useRef<HTMLDivElement | null>(null);
  const targetCount = 2500;
  const fullText = "en direct des vignerons";

  // Observer pour détecter l'élément visible
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

  // Animation du texte
  useEffect(() => {
    if (isVisible && displayedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1));
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isVisible, displayedText]);

  return (
    <>
      <div className='-mt-2 relative h-full w-full pb-[100%]'>
        <br /><br />
        <Image
          src="/images/mbnr.png"
          width={500}
          height={460}
          quality={100}
          priority={true}
          alt="100% engagée pour la nature"
          className="absolute top-0 left-0 w-full h-full"
          onLoad={(e) => {
            const image = e.target as HTMLImageElement;
            if (typeof caches !== 'undefined') {
              caches.open('image-cache').then(cache => {
                cache.add(image.src);
              });
            }
          }}
        />
      </div>

      <div
        ref={introRef}
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } flex flex-col items-center text-center lg:hidden bg-primary py-6 min-h-[200px] h-auto`}
        style={{ overflow: 'hidden', transition: 'opacity 1s ease, height 1s ease' }}
      >
        <div className="flex space-x-8 h-[35px] items-center">
          <div className="w-[30px] h-[30px] relative">
            <Image
              src="/images/bio2.png"
              alt="bio logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <div className="w-[40px] h-[40px] relative">
            <Image
              src="/images/Logobioeu.jpg"
              alt="Bio euro logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <div className="w-[35px] h-[35px] relative">
            <Image
              src="/images/logointro2.jpg"
              alt="nature et progrès"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
        </div>

        <div className="flex flex-col items-center mx-auto mt-3 slide-in-right">
          <h1 className="text-2xl font-extrabold text-white tracking-tight text-center leading-tight">
            {displayedText}
            {displayedText === fullText && (
              <>
                <span className='text-md'>(nes)</span>
                <span className="block text-white text-xs">
                  Tu sais, celles et ceux qui respectent la terre, ses locataires...
                </span>
              </>
            )}
          </h1>
        </div>

        <div className="flex space-x-8 mt-4 mb-4 h-[35px] items-center">
          <div className="w-[38px] h-[38px] relative">
            <Image
              src="/images/logointro.jpg"
              alt="biodynamie logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <div className="w-[45px] h-[45px] relative">
            <Image
              src="/images/déméter.png"
              alt="Biodynamie logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
          <div className="w-[38px] h-[38px] relative">
            <Image
              src="/images/biodyvin.jpg"
              alt="biodyvin logo"
              fill
              className="object-contain"
              priority={true}
            />
          </div>
        </div>
        <br />
        <MobileSlider />
      </div>
    </>
  );
};

export default MobileProductsIntro;
