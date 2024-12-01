import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const categories = [
  { id: 1, title: "Les Blancs", image: '/images/vins-fete.jpg', ref: '/vins/blanc' },
  { id: 2, title: 'Les Rosés', image: '/images/vins_fruitees.webp', ref: '/vins/rose' },
  { id: 3, title: 'Les Petillants', image: '/images/cat3.webp', ref: '/vins/petillant' },
  { id: 4, title: 'Les Rouges', image: '/images/cat4.webp', ref: '/vins/rouge' },
];

const CatSlider = () => {
  const [randomCategories, setRandomCategories] = useState<typeof categories>([]);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  useEffect(() => {
    // Function to get 3 random unique categories
    const getRandomCategories = () => {
      const shuffled = [...categories].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };

    setRandomCategories(getRandomCategories());
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-4">
        {randomCategories.map((category) => (
          <div
            key={category.id}
            className={`relative rounded-lg overflow-hidden transition-transform duration-300
              ${hoveredCategory === category.id ? 'scale-105 z-10' : 'scale-100'}`}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link href={`${category.ref}`} passHref>
              <div
                className="w-full h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                  <h3 className="text-white text-2xl font-bold">{category.title}</h3>
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
