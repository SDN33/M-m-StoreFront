import React, { useEffect, useState } from 'react';

const FallingBottlesPromo = () => {
  // Liste des émojis de bouteilles représentant les vins sans sulfites
  const bottles = React.useMemo(() => ["🍷", "🍾", "🥂", "🍇"], []);

  interface Bottle {
    id: string;
    left: number;
    angle: number;
    size: number;
    opacity: number;
    speed: number;
    timestamp: number;
    emoji: string;
  }

  const [fallingBottles, setFallingBottles] = useState<Bottle[]>([]);

  useEffect(() => {
    const createBottle = () => {
      const newBottle = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        left: Math.random() * 100,
        angle: Math.random() * 360,
        size: Math.random() * (40 - 30) + 30, // Taille des bouteilles ajustée
        opacity: Math.random() * (1 - 0.7) + 0.7,
        speed: Math.random() * (10 - 6) + 6,
        timestamp: Date.now(),
        emoji: bottles[Math.floor(Math.random() * bottles.length)]
      };
      setFallingBottles(prev => [...prev, newBottle]);
    };

    const interval = setInterval(createBottle, 300);

    const cleanupInterval = setInterval(() => {
      setFallingBottles(prev => prev.filter(bottle => Date.now() - bottle.timestamp < 5000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [bottles]);

  return (
    <div className="relative w-full min-h-[150px] overflow-hidden bg-gradient-to-r from-green-400 via-green-700 to-green-800 rounded-t-xl">
      {/* Bouteilles qui tombent */}
      {fallingBottles.map(bottle => (
        <div
          key={bottle.id}
          className="absolute animate-fall pointer-events-none"
          style={{
            left: `${bottle.left}%`,
            transform: `rotate(${bottle.angle}deg)`,
            fontSize: `${bottle.size}px`,
            opacity: bottle.opacity,
            animation: `fall ${bottle.speed}s linear`,
          }}
        >
          {bottle.emoji}
        </div>
      ))}

      {/* Contenu superposé */}
      <div className="relative z-10 text-center py-10">
        <h1 className="text-4xl font-bold text-white">Vins Sans Sulfites</h1>
        <p className="text-lg text-white mt-2">Naturellement délicieux, sans additifs chimiques !</p>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }
          100% {
            transform: translateY(400px) rotate(360deg);
          }
        }
        .animate-fall {
          will-change: transform;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default FallingBottlesPromo;
