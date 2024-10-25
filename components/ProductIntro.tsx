'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const ProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter, setCounter] = useState(0); // State for the counter
  const introRef = useRef<HTMLDivElement | null>(null);
  const targetCount = 2500; // The total number of products (you can replace this with a dynamic value if needed)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
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

  // Effect to animate the counter
  useEffect(() => {
    if (isVisible && counter < targetCount) {
      const interval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter < targetCount) {
            return prevCounter + 50; // Adjust the increment speed here
          } else {
            clearInterval(interval);
            return targetCount;
          }
        });
      }, 50); // Update every 50ms for smooth animation

      return () => clearInterval(interval);
    }
  }, [isVisible, counter, targetCount]);

  return (
    <div
      ref={introRef}
      className={`flex flex-col md:flex-row justify-between items-center mb-4 ${isVisible ? 'slide-in-visible' : 'slide-in'}`}
    >
      {/* Texte au centre avec espacement */}
      <div className="flex mx-auto mt-10 slide-in-right">
        <h3 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight text-center">
          {counter.toLocaleString()} vins <span className="text-green-600">bio</span> en direct des vignerons<span className="text-accent">(nes)</span>
          <br />
          <div className="text-gray-800 text-sm">
            Tu sais, celles et ceux qui respectent la terre, ses locataires...
          </div>
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
