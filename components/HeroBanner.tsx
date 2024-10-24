import Image from 'next/image';
import { useState } from 'react';



const HeroBanner = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);


  return (
    <div className="relative container max-h-100 w-auto mx-auto px-4 py-12 flex justify-center items-center bg-black">
      <div className="absolute bg-black"></div>

      {/* Conteneur avec z-10 pour rester au-dessus de l'image de fond */}
      <div className="mt-20 flex items-center text-center  text-white relative">
        <p className="text-white text-3xl sm:text-4xl !font-black sloganhero">
          <Image src="/images/logo3.svg" alt="Logo" width={400} height={200} className="mx-auto"></Image>
          2500 vins bio en direct des vignerons(nes)
          <br /><span className='text-xl md:text-3xl font-semibold sloganhero text-primary'>En direct des vignerons(nes)</span>
        </p>
        <br />
      </div>
    </div>
  );
};

export default HeroBanner;
