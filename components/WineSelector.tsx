import React, { useState } from 'react';
import { Wine } from 'lucide-react';

const WineSelector = () => {
  const [hoveredWine, setHoveredWine] = useState<string | null>(null);

  const wines = [
    { color: 'red', name: 'Rouge', bg: 'from-red-900 to-red-700' },
    { color: 'white', name: 'Blanc', bg: 'from-yellow-200 to-yellow-100' },
    { color: 'rose', name: 'Rosé', bg: 'from-pink-400 to-pink-300' },
    { color: 'sparkling', name: 'Pétillant', bg: 'from-yellow-300 to-yellow-200' },
    { color: 'dessert', name: 'Liquoreux', bg: 'from-amber-700 to-amber-600' }
  ];

  const handleWineClick = (color: string) => {
    console.log(`Navigating to ${color} wine page`);
    // Logique de navigation à implémenter ici
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-12 p-12 bg-gray-100 rounded-xl shadow-lg">
      {wines.map((wine) => (
        <div
          key={wine.color}
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => handleWineClick(wine.color)}
          onMouseEnter={() => setHoveredWine(wine.color)}
          onMouseLeave={() => setHoveredWine(null)}
        >
          <div className={`
            w-24 h-40 rounded-full bg-gradient-to-b ${wine.bg}
            flex items-center justify-center mb-4
            shadow-lg transform transition-all duration-300 ease-in-out
            ${hoveredWine === wine.color ? 'scale-110 rotate-6' : ''}
            group-hover:shadow-xl
          `}>
            <Wine
              size={48}
              className={`
                text-white transition-all duration-300
                ${hoveredWine === wine.color ? 'scale-110' : ''}
              `}
            />
          </div>
          <span className={`
            text-xl font-semibold transition-all duration-300
            ${hoveredWine === wine.color ? 'text-2xl text-indigo-600' : 'text-gray-800'}
          `}>
            {wine.name}
          </span>
          <div className={`
            mt-2 h-1 bg-indigo-600 transition-all duration-300 ease-out
            ${hoveredWine === wine.color ? 'w-full' : 'w-0'}
          `}/>
        </div>
      ))}
    </div>
  );
};

export default WineSelector;
