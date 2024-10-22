'use client'; // Assure que le composant est côté client
import React, { useState } from 'react';
import Link from 'next/link'; // Utilise le composant Link de Next.js pour les redirections

const WineSelector = () => {
  const [hoveredWine, setHoveredWine] = useState<string | null>(null);

  const wines = [
    { color: 'rouge', name: 'Rou', bg: 'bg-red-800', path: '/products/category/rouge' },
    { color: 'blanc', name: 'Bla', bg: 'bg-yellow-500', path: '/products/category/blanc' },
    { color: 'rose', name: 'Ros', bg: 'bg-pink-400', path: '/products/category/rose' },
    { color: 'petillant', name: 'Pét', bg: 'bg-yellow-200', path: '/products/category/petillant' },
    { color: 'liquoreux', name: 'Liq', bg: 'bg-amber-600', path: '/products/category/liquoreux' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center items-start gap-3 pt-8 p-4 bg-transparent -ml-2 lg:-ml-14">
      {wines.map((wine, index) => (
        <Link href={wine.path} key={wine.color} passHref> {/* Utilisation du lien Next.js */}
          <div
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out
                      ${hoveredWine === wine.color ? 'translate-y-[-8px]' : ''}
                      ${index === 0 ? 'sm:-ml-0' : 'sm:-ml-8'}`}
            onMouseEnter={() => setHoveredWine(wine.color)}
            onMouseLeave={() => setHoveredWine(null)}
          >
            <div className={`w-12 sm:w-14 h-20 sm:h-24 rounded-full ${wine.bg} flex items-center justify-center shadow-md relative overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gradient-to-r from-gray-900 via-gray-800 to-black font-black text-xs sm:text-sm transform rotate-[-90deg] whitespace-nowrap">
                  {wine.name}
                </span>
              </div>
              <div className="w-8 sm:w-10 h-14 sm:h-16 bg-gray-100/20 absolute bottom-1 rounded-full"></div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default WineSelector;
