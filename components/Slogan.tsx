import React, { useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import Reseaux from './Reseaux';

const Slogan: React.FC = () => {
  const h2Ref = useRef<HTMLHeadingElement | null>(null);
  const engagementRefs: React.RefObject<HTMLDivElement>[] = [useRef<HTMLDivElement | null>(null), useRef<HTMLDivElement | null>(null), useRef<HTMLDivElement | null>(null)];
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
  }, [engagementRefs]);

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
  }, [engagementRefs]);

  return (
    <div
      className="relative py-10 md:py-10 -mt-4 min-h-[700px] md:min-h-[200px] overflow-hidden"
      style={{ backgroundColor: '#EC641D' }}
    >
      {/* SVG Background with brand color */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1300 550"
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FF6B4A', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0000', stopOpacity: 1 }} />
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
      <div className="absolute bottom-0 right-0 w-[100px] md:w-[200px] h-[100px] md:h-[200px] bg-white opacity-10 rounded-tl-full"></div>
      <div className="absolute right-0 bottom-0 w-[150px] md:w-[350px]">
        <Image
          src="/images/meme-pas-contente.png"
          alt="Mémé Newsletter"
          className="object-cover absolute right-0 bottom-0"
          width={300}
          height={100}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center text-white z-10 px-4 mt-6">
        <h2
          ref={h2Ref}
          className={`text-3xl md:text-4xl leading-tight font-black mb-2 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            } md:transition-none`}
        >
          Avec Mémé Georgette, c&apos;est simple... <br />
          <span className="sloganhero font-light text-sm md:text-xl">
            Du vin bio directement chez vous, pour pas plus cher ! *
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row justify-center items-center mt-10 space-y-6 sm:space-y-0 sm:space-x-4">
          {['Notre Engagement', 'Circuit Court', 'Éco-Responsable'].map((title, index) => (
            <div
              key={index}
              ref={engagementRefs[index]}
              className={`relative w-full sm:w-1/3 transition-all duration-700 ${
                cardsVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${index === 0 ? 'md:transition-none' : ''}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="bg-white/95 backdrop-blur-sm text-gray-800 rounded-xl p-4 sm:p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
                <h3 className="font-bold text-md sm:text-lg" style={{ color: '#FF6B4A' }}>{title}</h3>
                <p className="text-xs sm:text-sm">
                  {index === 0
                    ? 'Nous travaillons main dans la main avec des producteurs locaux pour offrir des vins de qualité.'
                    : index === 1
                    ? 'Nos vins sont livrés directement du producteur à votre table, sans intermédiaire.'
                    : 'Engagé à respecter l\'environnement en choisissant des pratiques durables et non polluante.'}
                </p>
              </div>
              <div
                className={`absolute ${
                  index === 0 ? '-top-3 -right-3' : index === 1 ? '-top-3 -left-3' : '-bottom-3 -right-3'
                } w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg`}
                style={{
                  backgroundColor: index === 1
                    ? '#ff8568'
                    : index === 0
                    ? '#ff7857'
                    : '#FF6B4A'
                }}
              ></div>
            </div>
          ))}
        </div>
        <br />
        <span className="text-white text-xs block mt-4 -pb-8">* en comparaison avec les vins non biologiques</span>
        <Reseaux />
      </div>
    </div>
  );
};

export default Slogan;
