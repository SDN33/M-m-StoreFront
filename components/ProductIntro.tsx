'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

const ProductsIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const introRef = useRef<HTMLDivElement | null>(null);
  const targetCount = 2500;

  // Scroll animation
  const { scrollY } = useScroll({ layoutEffect: false });
  const y = useTransform(scrollY, [0, 1000], [0, -100]); // Adjust as needed

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
    <motion.div
      ref={introRef}
      className="relative overflow-hidden bg-white px-4 sm:px-6 md:px-8 lg:px-18 sm:py-24 md:py-32 shadow-lg text-center slide-in mt-2 md:mt-16 lg:mt-3 mb-16 lg:mb-0"
      style={{ y }}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3000 500' className='absolute inset-0 w-screen h-full'>
        <rect fill='#ffffff' className='w-full h-full'/>
        <defs>
          <rect stroke='#ffffff' strokeWidth='.5' width='1' height='1' id='s'/>
          <pattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='scale(13.95) translate(-928.32 -696.24)'>
            <use fill='#fcfcfc' href='#s' y='2'/>
            <use fill='#fcfcfc' href='#s' x='1' y='2'/>
            <use fill='#fafafa' href='#s' x='2' y='2'/>
            <use fill='#fafafa' href='#s'/>
            <use fill='#f3f2f2' href='#s' x='2'/>
            <use fill='#f3f2f2' href='#s' x='1' y='1'/>
          </pattern>
          <pattern id='b' width='7' height='11' patternUnits='userSpaceOnUse' patternTransform='scale(13.95) translate(-928.32 -696.24)'>
            <g fill='#f5f5f5'>
              <use href='#s'/>
              <use href='#s' y='5'/>
              <use href='#s' x='1' y='10'/>
              <use href='#s' x='2' y='1'/>
              <use href='#s' x='2' y='4'/>
              <use href='#s' x='3' y='8'/>
              <use href='#s' x='4' y='3'/>
              <use href='#s' x='4' y='7'/>
              <use href='#s' x='5' y='2'/>
              <use href='#s' x='5' y='6'/>
              <use href='#s' x='6' y='9'/>
            </g>
          </pattern>
          <pattern id='h' width='5' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(13.95) translate(-928.32 -696.24)'>
            <g fill='#f5f5f5'>
              <use href='#s' y='5'/>
              <use href='#s' y='8'/>
              <use href='#s' x='1' y='1'/>
              <use href='#s' x='1' y='9'/>
              <use href='#s' x='1' y='12'/>
              <use href='#s' x='2'/>
              <use href='#s' x='2' y='4'/>
              <use href='#s' x='3' y='2'/>
              <use href='#s' x='3' y='6'/>
              <use href='#s' x='3' y='11'/>
              <use href='#s' x='4' y='3'/>
              <use href='#s' x='4' y='7'/>
              <use href='#s' x='4' y='10'/>
            </g>
          </pattern>
          <pattern id='c' width='17' height='13' patternUnits='userSpaceOnUse' patternTransform='scale(13.95) translate(-928.32 -696.24)'>
            <g fill='#f2f2f2'>
              <use href='#s' y='11'/>
              <use href='#s' x='2' y='9'/>
              <use href='#s' x='5' y='12'/>
              <use href='#s' x='9' y='4'/>
              <use href='#s' x='12' y='1'/>
              <use href='#s' x='16' y='6'/>
            </g>
          </pattern>
          <pattern id='d' width='19' height='17' patternUnits='userSpaceOnUse' patternTransform='scale(13.95) translate(-928.32 -696.24)'>
            <g fill='#cef5ce'>
              <use href='#s' y='9'/>
              <use href='#s' x='16' y='5'/>
              <use href='#s' x='14' y='2'/>
              <use href='#s' x='11' y='11'/>
              <use href='#s' x='6' y='14'/>
            </g>
            <g fill='#fcfcfc'>
              <use href='#s' x='3' y='13'/>
              <use href='#s' x='9' y='7'/>
              <use href='#s' x='13' y='10'/>
              <use href='#s' x='15' y='4'/>
              <use href='#s' x='18' y='1'/>
            </g>
          </pattern>
          <pattern id='e' width='47' height='53' patternUnits='userSpaceOnUse' patternTransform='scale(13.95) translate(-928.32 -696.24)'>
            <g fill='#fcfcfc'>
              <use href='#s' x='2' y='5'/>
              <use href='#s' x='16' y='38'/>
              <use href='#s' x='46' y='42'/>
              <use href='#s' x='29' y='20'/>
            </g>
          </pattern>
          <pattern id='f' width='59' height='71' patternUnits='userSpaceOnUse' patternTransform='scale(13.95) translate(-928.32 -696.24)'>
            <g fill='#fcfcfc'>
              <use href='#s' x='33' y='13'/>
              <use href='#s' x='27' y='54'/>
              <use href='#s' x='55' y='55'/>
            </g>
          </pattern>
          <pattern id='g' width='139' height='97' patternUnits='userSpaceOnUse' patternTransform='scale(13.95) translate(-928.32 -696.24)'>
            <g fill='#fcfcfc'>
              <use href='#s' x='11' y='8'/>
              <use href='#s' x='51' y='13'/>
              <use href='#s' x='17' y='73'/>
              <use href='#s' x='99' y='57'/>
            </g>
          </pattern>
        </defs>
        <rect fill='url(#a)' width='100%' height='100%'/>
        <rect fill='url(#b)' width='100%' height='100%'/>
        <rect fill='url(#h)' width='100%' height='100%'/>
        <rect fill='url(#c)' width='100%' height='100%'/>
        <rect fill='url(#d)' width='100%' height='100%'/>
        <rect fill='url(#e)' width='100%' height='100%'/>
        <rect fill='url(#f)' width='100%' height='100%'/>
        <rect fill='url(#g)' width='100%' height='100%'/>
      </svg>

      <div className="container mx-auto -mb-60 -mt-10 md:-mt-14 md:mb-8 lg:-mb-60 xl:mb-0 relative z-10">
        <div className="relative z-10 flex flex-col items-center lg:flex-row lg:justify-between">
          {/* Left Logos (Mobile Hidden) */}
          <div className="hidden lg:flex xl:flex space-x-4 mb-4 lg:mb-0">
            <Image
              src="/images/bio2.png"
              alt="bio logo"
              width={100}
              height={100}
              className="object-contain w-10 lg:min-w-8 h-auto"
              priority
            />
            <Image
              src="/images/Logobioeu.jpg"
              alt="Bio euro logo"
              width={100}
              height={100}
              className="object-contain w-10 lg:min-w-8 h-auto"
              priority
            />
            <Image
              src="/images/Biodynamie-logo.png"
              alt="Biodynamie logo"
              width={100}
              height={100}
              className="object-contain w-12 lg:min-w-8 h-auto"
              priority
            />
          </div>

          {/* Central Text with Counter */}
          <div className="flex flex-col items-center text-center w-full lg:w-auto ">
            <h1 className="text-2xl sm:text-2xl lg:text-2xl font-gray-950 font-black text-primary tracking-tight leading-tight">
              <span className="block text-4xl sm:text-2xl mb-2 mt-1">
                <motion.span
                  className="text-3xl font-gray-950"
                  initial={{ scale: 1 }}
                  animate={counter === targetCount ? {
                  scale: [1, 1.2, 1],
                  transition: {
                    duration: 0.5,
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                  }
                  } : {}}
                >
                  {counter.toLocaleString()}
                </motion.span>
                <span className='text-3xl'>&nbsp;vins bio en direct des vignerons(nes)</span>
              </span>
              <span className="block bg-transparent text-gray-950 text-base sm:text-sm -mt-1 mb-2 ">
                Tu sais, celles et ceux qui respectent la terre, ses locataires...
              </span>
            </h1>
          </div>

          {/* Right Logos (Mobile Hidden) */}
          <div className="hidden lg:flex space-x-4 mb-4 lg:mb-0">
            <Image
              src="/images/logointro.jpg"
              alt="biodynamie logo"
              width={100}
              height={100}
              className="object-contain w-12 lg:min-w-9 h-auto"
              priority
            />
            <Image
              src="/images/biodyvin.jpg"
              alt="biodyvin logo"
              width={100}
              height={100}
              className="object-contain w-14 lg:min-w-8 h-auto"
              priority
            />
            <Image
              src="/images/logointro2.jpg"
              alt="nature et progrès"
              width={100}
              height={100}
              className="object-contain w-10 lg:min-w-8 h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsIntro;
