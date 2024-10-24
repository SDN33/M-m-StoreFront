'use client';
import React, { useState } from 'react';
import Link from 'next/link';

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
    <div className="flex justify-center items-center w-full py-8">
      <div className="flex space-x-4 px-4">
        {wines.map((wine) => (
          <Link href={wine.path} key={wine.color}>
            <div
              className={`transform transition-all duration-300 ease-in-out hover:scale-110
                ${hoveredWine === wine.color ? 'translate-y-[-8px]' : ''}`}
              onMouseEnter={() => setHoveredWine(wine.color)}
              onMouseLeave={() => setHoveredWine(null)}
            >
              <div className={`w-16 h-24 rounded-full ${wine.bg} flex items-center justify-center shadow-lg relative overflow-hidden mx-2`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black font-black text-sm transform rotate-[-90deg] whitespace-nowrap">
                    {wine.name}
                  </span>
                </div>
                <div className="w-10 h-16 bg-white/20 absolute bottom-1 rounded-full"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WineSelector;
