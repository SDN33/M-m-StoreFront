import { useState, useEffect } from 'react';
import Link from 'next/link';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      imageUrl: '/images/slider1.png',
      title: 'Château Moulin De Peyronin',
      subtitle: 'Vignoble Bordelais eco-responsable',
      description: 'bienfait pour nous !',
      discount: '-10%',
      link: '/selection'
    },
    {
      id: 2,
      imageUrl: '/images/slider2.png',
      title: 'Château Moulin De Peyronin',
      subtitle: 'Vignoble Bordelais eco-responsable',
      description: 'bienfait pour nous !',
      discount: '-10%',
      link: '/selection'
    },
    {
      id: 3,
      imageUrl: '/images/slider3.png',
      title: 'Château Moulin De Peyronin',
      subtitle: 'Vignoble Bordelais eco-responsable',
      description: 'bienfait pour nous !',
      discount: '-10%',
      link: '/selection'
    }

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

            {/* Content */}
            <div className="relative h-full container mx-auto flex items-center px-8">
              <div className="text-white max-w-2xl">
                <h2 className=" flex text-3xl font-serif">{slide.title}</h2>
                <h3 className="text-xl mb-2 font-serif">{slide.subtitle}</h3>
                <p className="text-lg mb-6">{slide.description}</p>

                <div className="flex items-center gap-6">
                  <Link
                    href={slide.link}
                    className="bg-white text-black px-6 py-3 rounded-md text-lg font-semibold
                           hover:text-primary hover-animate transition-colors duration-300
                             shadow-lg hover:shadow-xl"
                  >
                    Découvrir la sélection
                  </Link>
                </div>
              </div>
            </div>
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
