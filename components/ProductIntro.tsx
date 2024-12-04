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
      className="relative overflow-hidden bg-gray-100 px-4 sm:px-6 md:px-8 lg:px-18 sm:py-24 md:py-32 shadow-lg text-center slide-in mt-2 md:mt-16 lg:mt-3 "
    >
      <div className="container mx-auto -mb-60 -mt-10 md:-mt-14 md:mb-8 lg:-mb-60 xl:mb-0">
      <div className="relative z-10 flex flex-col items-center lg:flex-row lg:justify-between">
        {/* Left Logos (Mobile Hidden) */}
        <div className="hidden md:flex lg:flex space-x-4 mb-4 lg:mb-0">
        <Image
          src="/images/bio2.png"
          alt="bio logo"
          width={40}
          height={30}
          className="object-contain w-10 lg:min-w-8 h-auto"
          priority
        />
        <Image
          src="/images/Logobioeu.jpg"
          alt="Bio euro logo"
          width={50}
          height={50}
          className="object-contain w-12 lg:min-w-8 h-auto"
          priority
        />
        <Image
          src="/images/Biodynamie-logo.png"
          alt="Biodynamie logo"
          width={50}
          height={50}
          className="object-contain w-12 lg:min-w-8 h-auto"
          priority
        />
        </div>

        {/* Central Text with Counter */}
        <div className="flex flex-col items-center text-center w-full lg:w-auto ">
        <h1 className="text-2xl sm:text-2xl lg:text-2xl font-gray-950 font-black text-primary tracking-tight leading-tight">
          <span className="block text-4xl sm:text-2xl mb-2 mt-1">
          <span className="text-3xl font-gray-950  font-[Inter]">{counter.toLocaleString()}</span>
          <span className='text-3xl'>&nbsp;vins bio en direct des vignerons(nes)</span>
          </span>
          <span className="block bg-transparent text-gray-950 text-base sm:text-sm font-['Inter'] -mt-1 mb-2 ">
          Tu sais, celles et ceux qui respectent la terre, ses locataires...
          </span>
        </h1>
        </div>

        {/* Right Logos (Mobile Hidden) */}
        <div className="hidden lg:flex space-x-4 mb-4 lg:mb-0">
        <Image
          src="/images/logointro.jpg"
          alt="biodynamie logo"
          width={60}
          height={30}
          className="object-contain w-12 lg:min-w-8 h-auto"
          priority
        />
        <Image
          src="/images/biodyvin.jpg"
          alt="biodyvin logo"
          width={60}
          height={30}
          className="object-contain w-14 lg:min-w-8 h-auto"
          priority
        />
        <Image
          src="/images/logointro2.jpg"
          alt="nature et progrès"
          width={35}
          height={28}
          className="object-contain w-10 lg:min-w-8 h-auto"
          priority
        />
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductsIntro;
