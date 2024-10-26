import Image from 'next/image';
import { useEffect, useState } from 'react';

const slogans = [
  "Boire un vin bio est un acte révolutionnaire !",
  "La vigne couvre 4% de la surface agricole nationale,<br />mais à elle seule c'est 20% des pesticides...",
  "Le vin bio est un choix pour la terre, et pour notre santé !",
  "La biodynamie,<br />un gage de qualité et de respect de l'environnement !",
  "Soutenir les vignerons,<br />c'est préserver notre avenir à tous !",
  "Des vignes cultivées sans chimie, pour un goût authentique et naturel",
];

const HeroBanner = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan(prev => (prev + 1) % slogans.length);
    }, 5000); // Change de slogan toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative container mx-auto px-4 flex flex-col justify-center items-center bg-primary py-4"> {/* Réduit le padding vertical */}
      <div className="flex flex-col items-center text-center z-10 text-white relative max-w-md"> {/* Réduit la largeur maximale */}
        <h1 className="text-2xl md:text-2xl leading-tight md:font-bold sloganhero font-semibold"> {/* Réduit la taille de la police */}
          <span
            className="block font-serif fade-in min-h-[3rem] md:min-h-[4rem]"
            dangerouslySetInnerHTML={{ __html: slogans[currentSlogan] }}
          />
        </h1>
        <div className='border-t-2 border-white w-16 mt-2'></div> {/* Réduit la largeur de la bordure et l'espacement */}
        <Image
          src="/images/memelogo.png"
          alt="Mémé Georgette"
          className="mt-6 object-contain"
          width={150}
          height={150}
        />
      </div>
    </div>
  );
};

export default HeroBanner;
