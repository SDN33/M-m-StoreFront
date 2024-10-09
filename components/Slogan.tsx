import React from 'react';

const Slogan: React.FC = () => {
  return (
    <div className="bg-orange-500 py-10">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Avec Mémé Georgette, c'est simple... <br />
          <span className='sloganhero font-light'>Du vin bio directement chez vous, et pour pas plus cher ! *</span>
        </h2>

        <div className="flex flex-col md:flex-row justify-around items-center mt-10">
          <div className="relative mb-6 md:mb-0">
            <div className="bg-white text-gray-800 rounded-full p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="font-bold text-lg">Notre Engagement</h3>
              <p className="text-sm">
                Nous travaillons main dans la main avec des producteurs locaux pour offrir des vins de qualité.
              </p>
            </div>
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-black rounded-full"></div>
          </div>

          <div className="relative mb-6 md:mb-0">
            <div className="bg-white text-gray-800 rounded-full p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="font-bold text-lg">Circuit Court</h3>
              <p className="text-sm">
                Nos vins sont livrés directement du producteur à votre table, sans intermédiaire.
              </p>
            </div>
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full"></div>
          </div>

          <div className="relative mb-6 md:mb-0">
            <div className="bg-white text-gray-800 rounded-full p-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="font-bold text-lg">Élan Éco-Responsable</h3>
              <p className="text-sm">
                Nous nous engageons à respecter l'environnement en choisissant des pratiques durables.
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-black rounded-full"></div>
          </div>
          <br />
        </div>
      </div>
      <br />
      <span className='absolute text-white text-xs block mt-2 right-[28rem]'>* en comparaison avec les vins non bio</span>

    </div>
  );
};

export default Slogan;
