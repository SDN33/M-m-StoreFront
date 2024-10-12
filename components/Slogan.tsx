import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";

const Slogan: React.FC = () => {
  const h2Ref = useRef<HTMLHeadingElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.intersectionRatio > 0.3) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 } // 30% de visibilité
    );

    const currentH2Ref = h2Ref.current; // Copier la valeur dans une variable locale

    if (currentH2Ref) {
      observer.observe(currentH2Ref);
    }

    return () => {
      if (currentH2Ref) {
        observer.unobserve(currentH2Ref); // Utiliser la variable locale ici
      }
    };
  }, []);

  return (
    <div className="relative bg-orange-500 py-10 md:py-20 min-h-[700px] md:min-h-[400px]">
      {/* Decorative image */}
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-gray-200 opacity-10 rounded-tl-full"></div>
      {/* Image positionnée en bas à droite */}
      <div className="absolute right-0 bottom-0">
        <Image src="/images/mémé-georgette2.png" alt="Mémé Newsletter" width={300} height={300} />
      </div>

      <div className="max-w-4xl mx-auto text-center text-white">
        {/* Ajout de la classe d'animation lorsque le H2 devient visible */}
        <h2
          ref={h2Ref}
          className={`text-4xl md:text-4xl leading-tight font-black mb-2 ${isVisible ? 'slide-in-right' : ''}`}
        >
          Avec Mémé Georgette, c&apos;est simple... <br />
          <span className="sloganhero font-light text-sm md:text-xl">
            Du vin bio directement chez vous, pour pas plus cher ! *
          </span>
          <div className="flex justify-center items-center mt-2">
            <Image src="/images/logobio.webp" alt="Logo BIO" width={20} height={10} />
            <Image src="/images/demeter-logo.png" className="pl-4" alt="Logo DEMETER" width={50} height={70} />
          </div>
        </h2>

        <div className="flex flex-col md:flex-row justify-around items-center mt-10">
          <div className="relative mb-6 md:mb-0">
            <div className="bg-white text-gray-800 rounded-full p-4 md:p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="font-bold text-md md:text-lg">Notre Engagement</h3>
              <p className="text-xs md:text-sm">
                Nous travaillons main dans la main avec des producteurs locaux pour offrir des vins de qualité.
              </p>
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 bg-black rounded-full"></div>
          </div>

          <div className="relative mb-6 md:mb-0">
            <div className="bg-white text-gray-800 rounded-full p-4 md:p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="font-bold text-md md:text-lg">Circuit Court</h3>
              <p className="text-xs md:text-sm">
                Nos vins sont livrés directement du producteur à votre table, sans intermédiaire.
              </p>
            </div>
            <div className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full"></div>
          </div>

          <div className="relative mb-6 md:mb-0">
            <div className="bg-white text-gray-800 rounded-full p-4 md:p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="font-bold text-md md:text-lg">Élan Éco-Responsable</h3>
              <p className="text-xs md:text-sm">
                Nous nous engageons à respecter l&apos;environnement en choisissant des pratiques durables.
              </p>
            </div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8 md:w-10 md:h-10 bg-black rounded-full"></div>
          </div>
        </div>
        <br />
        <span className="absolute text-white text-xs block mt-2 right-[28rem]">* en comparaison avec les vins non bio</span>
      </div>
    </div>
  );
};

export default Slogan;
