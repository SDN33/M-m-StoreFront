'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const WineSelector = () => {
  const [hoveredWine, setHoveredWine] = useState<string | null>(null);

  const wines = [
    { color: 'rouge', name: 'Rou', bg: 'bg-red-800', path: '/products/category/rouge', fullName: 'Rouges', slogan: 'Parfait pour les amateurs de viandes rouges et barbecues' },
    { color: 'blanc', name: 'Bla', bg: 'bg-yellow-500', path: '/products/category/blanc', fullName: 'Blancs', slogan: 'Idéal avec des fruits de mer et des plats légers' },
    { color: 'rose', name: 'Ros', bg: 'bg-pink-400', path: '/products/category/rose', fullName: 'Rosés', slogan: 'Le compagnon idéal pour vos pique-niques' },
    { color: 'petillant', name: 'Pét', bg: 'bg-teal-500', path: '/products/category/petillant', fullName: 'Pétillants', slogan: 'Pour célébrer chaque instant' },
    { color: 'liquoreux', name: 'Liq', bg: 'bg-amber-600', path: '/products/category/liquoreux', fullName: 'Liquoreux', slogan: 'Un délice pour accompagner vos desserts' },
  ];

  const getSlogan = () => {
    const hoveredWineInfo = wines.find(w => w.color === hoveredWine);
    if (hoveredWineInfo) {
      return hoveredWineInfo.slogan;
    }
    return "Rouges, Blancs, Rosés... on a le vin bio pour vous !";
  };

  return (
    <div className="flex flex-col items-center w-full mt-16 mb-16">
      <div className="flex space-x-12 px-4">
        {wines.map((wine) => (
          <Link href={wine.path} key={wine.color}>
            <div
              className={`transform transition-transform duration-300 ease-in-out hover:scale-110
                ${hoveredWine === wine.color ? 'translate-y-[-8px] opacity-90' : 'opacity-100'}`}
              onMouseEnter={() => setHoveredWine(wine.color)}
              onMouseLeave={() => setHoveredWine(null)}
            >
              <div className={`w-16 h-24 rounded-full ${wine.bg} flex items-center justify-center shadow-lg relative overflow-hidden mx-2`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-sm transform rotate-[-90deg] whitespace-nowrap">
                    {wine.name}
                  </span>
                </div>
                <div className="w-10 h-16 bg-white/20 absolute bottom-1 rounded-full"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <h2 className={`text-xl font-serif !mt-4 text-center min-h-[1rem] transition-all duration-300
          ${hoveredWine ? wines.find(w => w.color === hoveredWine)?.bg : 'text-gray-800'}`}>
        <strong>{getSlogan()}</strong>
      </h2>
    </div>
  );
};

export default WineSelector;
