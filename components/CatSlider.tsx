import React, { useState } from 'react';
import Link from 'next/link';

const categories = [
  { id: 1, title: "Vins de Fête de Fin d'Année", image: '/images/vins-fete.jpg' },
  { id: 2, title: 'Les Fruitées', image: '/images/vins_fruitees.webp' },
  { id: 3, title: 'Les Perles Rares', image: '/images/perles_rares.jpg' },
  // Ajoutez d'autres catégories selon vos besoins
];

const CatSlider = () => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`relative rounded-lg overflow-hidden transition-transform duration-300
              ${hoveredCategory === category.id ? 'scale-105 z-10' : 'scale-100'}`}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link href={`/categories/${category.id}`} passHref>
              <div
                className="w-full h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="flex items-center justify-center h-full bg-black bg-opacity-30">
                  <h3 className="text-white text-lg font-bold">{category.title}</h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatSlider;
