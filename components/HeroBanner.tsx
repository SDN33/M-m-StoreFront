import Image from 'next/image';
import { useState } from 'react';



const HeroBanner = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);


  return (
    <div className="relative container max-h-100 w-auto mx-auto px-4 py-12 flex justify-center items-center bg-primary">
      <br /><br />
      {/* Conteneur avec z-10 pour rester au-dessus de l'image de fond */}
      <div className="mt-28 flex items-center text-center  text-white relative">
        <p className="text-white text-3xl sm:text-4xl !font-black sloganhero">
          2500 vins bio en direct des vignerons<span className='text-accent'>(nes)</span>
        </p>
        <br />
      </div>
    </div>
  );
};

export default HeroBanner;
