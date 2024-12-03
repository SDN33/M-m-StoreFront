"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const MobileProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const introRef = useRef<HTMLDivElement | null>(null);
  const targetCount = 2500;
  const fullText = "Mémé Georgette";

  const [currentSlide, setCurrentSlide] = useState(0);
        const logos = [
          { src: "/images/bio2.png", alt: "bio logo", width: 30, height: 30, sizes: "30px" },
          { src: "/images/Logobioeu.jpg", alt: "Bio euro logo", width: 40, height: 40, sizes: "40px" },
          { src: "/images/logointro2.jpg", alt: "nature et progrès", width: 35, height: 35, sizes: "35px" },
          { src: "/images/logointro.jpg", alt: "biodynamie logo", width: 38, height: 38, sizes: "38px" },
          { src: "/images/Biodynamie-logo.png", alt: "Biodynamie logo", width: 45, height: 45, sizes: "45px" },
          { src: "/images/biodyvin.jpg", alt: "biodyvin logo", width: 38, height: 38, sizes: "38px" }
        ];

        useEffect(() => {
          const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % logos.length);
          }, 3000); // Longer duration for better visibility

          // Add CSS transition
          const slider = document.querySelector('.flex.transition-transform') as HTMLElement;
          if (slider) {
            slider.style.transition = 'all 1s ease-in-out';
            slider.style.opacity = '1';
          }

          return () => clearInterval(timer);
        }, [logos.length]);

        const LogoSlider: React.FC = () => (
          <div className="relative w-full h-[50px] overflow-hidden bg-gray-50">
            <div className="flex transition-transform duration-500 ease-in-out"
                 style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {logos.map((logo, index) => (
                <div key={index} className="min-w-full flex justify-center items-center">
                  <div className="relative" style={{ width: logo.width, height: logo.height }}>
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill={logo.width === logo.height}
                      width={logo.width === logo.height ? undefined : logo.width}
                      height={logo.width === logo.height ? undefined : logo.height}
                      sizes={logo.sizes}
                      className="object-contain"
                      priority={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

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
      <div
        ref={introRef}
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } relative bg-primary transform perspective-1000 rotate-x-1 shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_10px_rgba(255,255,255,0.2)]`}
        style={{ overflow: 'hidden', transition: 'opacity 1s ease, height 1s ease' }}      >
        <div className="flex flex-col items-center mx-auto mt-3 slide-in-right">
            <h1
              className="text-2xl font-extrabold text-gray-50 tracking-tight text-center leading-tight h-[90px]"
              dangerouslySetInnerHTML={{ __html: displayedText + (displayedText === fullText ? '<span class="block text-xs mt-2">ACHAT de VIN BIO et BIODYNAMIQUE<br />Rouge, Blanc, Rosé, Pétillant, Liquoreux</span>' : '') }}
            />
        </div>
        <div className="flex justify-center items-center bg-gray-50 rounded-xl shadow-md">
          <LogoSlider />
        </div>
        <div className="flex justify-center items-center mt-2 mb-6">
          <p className="text-xs text-gray-50">+ de {counter} vins biologiques</p>
        </div>
        <div className='absolute bottom-0 right-0'>
          <Image
            src="/images/meme-pas-contente.png"
            alt="Mémé Georgette"
            width={65}
            height={65}
          />
        </div>
      </div>
    </>
  );
};

export default MobileProductsIntro;
