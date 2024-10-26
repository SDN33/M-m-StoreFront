import { useState, useEffect } from 'react';
import Link from 'next/link';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      imageUrl: '/images/slider1.png',
      link: '/vendor/mémégeorgette' // Lien pour la quatrième diapositive
    },
    {
      id: 2,
      imageUrl: '/images/slider2.png',
      link: '/vendor/mémégeorgette' // Lien pour la troisième diapositive
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      {/* Slides container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative flex-shrink-0"
          >
            {/* Background image with gradient overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
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
