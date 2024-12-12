import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      imageUrl: 'https://res.cloudinary.com/daroyxenr/image/upload/q_auto/v1732880778/100_engag%C3%A9e_pour_la_nature_2_n2zvgy.webp',
      link: '/',
      lcp: true,
      rel: 'preconnect',
    },
    {
      id: 2,
      imageUrl: 'https://res.cloudinary.com/daroyxenr/image/upload/q_100/v1732974216/100_engag%C3%A9e_pour_la_nature_4_pwjwn9.webp',
      link: '/vignerons/255986134',
      lcp: true,
      rel: 'preconnect',
    },
    {
      id: 4,
      imageUrl: 'https://res.cloudinary.com/daroyxenr/image/upload/q_100/v1732982358/Banni%C3%A8re_fin_d_ann%C3%A9e_2_wpv7ow.webp',
      link: '/vignerons/255986119',
      lcp: true,
      rel: 'preconnect',
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
    <div className="relative w-full h-[20vh] sm:h-[20vh] md:h-[20vh] lg:h-[50vh] max-h-[300px] overflow-hidden bg-white md:-mt-52 lg:-mt-28  ">
      {/* Slides container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out bg-transparent"
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
            className={`w-8 h-5 rounded-full transition-colors duration-300
                       ${currentSlide === index
                         ? 'bg-white/90 scale-100'
                         : 'bg-white/50 scale-90 hover:scale-95'}`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
