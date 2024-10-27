import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const Slogan: React.FC = () => {
  const h2Ref = useRef<HTMLHeadingElement | null>(null);
  const engagementRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState([false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.intersectionRatio > 0.3) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentH2Ref = h2Ref.current;

    if (currentH2Ref) {
      observer.observe(currentH2Ref);
    }

    return () => {
      if (currentH2Ref) {
        observer.unobserve(currentH2Ref);
      }
    };
  }, []); // Assurez-vous que cette dépendance est bien fermée ici

  useEffect(() => {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setCardsVisible((prev) => {
              const newVisibility = [...prev];
              newVisibility[index] = true;
              return newVisibility;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    engagementRefs.forEach((ref) => {
      if (ref.current) cardObserver.observe(ref.current);
    });

    return () => {
      engagementRefs.forEach((ref) => {
        if (ref.current) cardObserver.unobserve(ref.current);
      });
    };
  }, []); // Ajout de la dépendance fermante ici

  return (
    <div className="relative bg-primary py-10 md:py-20 min-h-[750px] md:min-h-[400px] overflow-hidden">
      {/* SVG Background */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1300 550"
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#c2410c', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#fb923c', stopOpacity: 0.6 }} />
          </linearGradient>
        </defs>
        <path fill="url(#grad)">
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0 250C600 450 650 100 1300 250V550H0V250Z;
              M0 250C600 100 650 450 1300 250V550H0V250Z;
              M0 250C950 350 950 150 1300 250V550H0V250Z;
              M0 250C350 150 350 350 1300 250V550H0V250Z;
              M0 250C600 450 650 100 1300 250V550H0V250Z
            "
          />
        </path>
      </svg>

      {/* Decorative elements and content */}
      <div className="absolute bottom-0 right-0 w-[100px] md:w-[200px] h-[100px] md:h-[200px] bg-gray-200 opacity-10 rounded-tl-full"></div>
      <div className="absolute right-0 bottom-0 w-[150px] md:w-[350px]">
        <Image
          src="/images/meme-georgette.png"
          alt="Mémé Newsletter"
          className="w-full h-auto object-cover"
          width={500}
          height={300}
          loading='lazy'
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center text-white z-10 px-4">
        <h2
          ref={h2Ref}
          className={`text-3xl md:text-4xl leading-tight font-black mb-2 ${isVisible ? 'slide-in-right' : ''}`}
        >
          Avec Mémé Georgette, c&apos;est simple... <br />
          <span className="sloganhero font-light text-sm md:text-xl">
           L'achat de produits du terroir n'a jamais été aussi simple !
          </span>
        </h2>

        <div className="flex flex-col md:flex-row justify-around items-center mt-10 space-y-6 md:space-y-0 md:space-x-4">
          {['Notre Engagement', 'Circuit Court', 'Élan Éco-Responsable'].map((title, index) => (
            <div key={index} ref={engagementRefs[index]} className={`relative w-full md:w-1/3 ${cardsVisible[index] ? 'fade-in-up' : ''}`}>
              <div className="bg-white text-gray-800 rounded-xl p-4 md:p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
                <h3 className="font-bold text-md md:text-lg">{title}</h3>
                <p className="text-xs md:text-sm">
                  {index === 0
                    ? 'Nous travaillons main dans la main avec des producteurs locaux pour offrir des vins de qualité.'
                    : index === 1
                    ? 'Nos vins sont livrés directement du producteur à votre table, sans intermédiaire.'
                    : 'Nous nous engageons à respecter l\'environnement en choisissant des pratiques durables.'}
                </p>
              </div>
              <div className={`absolute ${index === 0 ? '-top-3 -right-3' : index === 1 ? '-top-3 -left-3' : '-bottom-3 -right-3'} w-8 h-8 md:w-10 md:h-10 bg-orange-${index === 1 ? '300' : '700'} rounded-full`}></div>
            </div>
          ))}
        </div>
        <br />
        <span className="text-white text-xs block">L&apos;abus d&apos;alcool est dangereux pour la santé, sachez consommer avec modération. Interdiction de vente de boissons alcooliques aux mineurs de -18 ans.</span>
      </div>
    </div>
  );
};

export default Slogan;
