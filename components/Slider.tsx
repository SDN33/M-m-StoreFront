import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      imageUrl: '/images/slider3.png',
      link: '/',
    },
    {
      id: 2,
      imageUrl: '/images/slider2.png',
      link: '/',
    },
    {
      id: 3,
      imageUrl: '/images/slider1.png',
      link: '/',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 12000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[20vh] sm:h-[20vh] md:h-[50vh] max-h-[300px] overflow-hidden bg-white">
      {/* Slides container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out bg-white"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative flex-shrink-0"
          >
            <div
              className="absolute inset-0 bg-center"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }}
            >
            </div>

            {/* Lien cliquable sur toute la diapositive */}
            <Link
              href={slide.link}
              className="absolute inset-0"
              aria-label={`Aller à ${slide.link}`}
            />
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300
                       ${currentSlide === index
                         ? 'bg-white scale-100'
                         : 'bg-white/50 scale-90 hover:scale-95'}`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
