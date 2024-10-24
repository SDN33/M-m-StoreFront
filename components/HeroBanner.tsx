import Image from 'next/image';
import { useState } from 'react';



const HeroBanner = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);


  return (
    <div className="relative container mx-auto px-4 py-12 flex justify-center items-center min-h-screen bg-black">
      <div className="absolute inset-0 bg-black opacity-50 md:hidden z-1"></div>

      {/* Conteneur avec z-10 pour rester au-dessus de l'image de fond */}
      <div className="md:mt-20 mt-36 space-y-3 md:space-y-0 flex items-center text-center  text-white relative">
        <p className="text-white text-4xl sm:text-5xl !font-black sloganhero">
          <Image src="/images/mémé-georgette2.png" alt="Logo" width={200} height={200} className="mx-auto mb-20"></Image>
          CAVE COOPÉRATIVE ENGAGÉE
          <br /><span className='text-xl md:text-3xl font-semibold sloganhero text-primary'>En direct des vignerons(nes)</span>
        </p>
        <br />
        <div>
          {/* Titre pour mobile */}
          <h1 className="text-xl md:text-4xl leading-tight font-black block md:hidden">
            <br />
            <p className="text-lg mt-4 md:text-xl font-light">- Mémé Georgette</p>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
