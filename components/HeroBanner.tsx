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
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 5000); // Change de slogan toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative container mx-auto px-4 flex flex-col justify-center items-center pb-8">
      <div className="flex flex-col items-center text-center z-10 relative max-w-md">
        <h1 className="lg:text-2xl md:text-lg sm:text-base  leading-tight md:font-bold sloganhero font-semibold">
          {/* Hauteur fixe ajustée selon le plus long slogan */}
          <span
            className="font-serif min-h-[6rem] md:min-h-[8rem] flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: slogans[currentSlogan] }}
          />
        </h1>
        <div className="border-t-2 border-accent w-16 mt-2"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
