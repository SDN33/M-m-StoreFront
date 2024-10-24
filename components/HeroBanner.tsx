
import { useEffect, useState } from 'react';

const slogans = [
  "À une époque de supercherie alimentaire,<br />boire un vin bio est un acte révolutionnaire !",
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
    <div className="relative container mx-auto px-4 flex flex-col justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black">
      {/* Conteneur avec z-10 pour rester*/}
      <div className=" flex items-center text-center z-10 text-white relative mb-10">

        <div>
          {/* Titre avec slogans */}
          <h1 className="text-4xl md:text-4xl leading-tight md:font-serif !font-semibold">
            <br />
            <span className="block fade-in" dangerouslySetInnerHTML={{ __html: slogans[currentSlogan] }} />
            <p className="text-lg mt-4 md:text-xl font-light">- Mémé Georgette</p>
          </h1>
        </div>
        <br />
      </div>
    </div>
  );
};

export default HeroBanner;
