import React, { useEffect, useState } from 'react';

const FallingEurosPromo = () => {
  interface Euro {
    id: string;
    left: number;
    angle: number;
    size: number;
    opacity: number;
    speed: number;
    timestamp: number;
  }

  const [euros, setEuros] = useState<Euro[]>([]);

  useEffect(() => {
    const createEuro = () => {
      const newEuro = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        left: Math.random() * 100,
        angle: Math.random() * 360,
        size: Math.random() * (24 - 16) + 16,
        opacity: Math.random() * (0.8 - 0.4) + 0.4,
        speed: Math.random() * (12 - 8) + 8,
        timestamp: Date.now(),
      };
      setEuros(prev => [...prev, newEuro]);
    };

    // Create new euros periodically
    const interval = setInterval(createEuro, 300);

    // Remove euros that have fallen beyond the screen after 5 seconds
    const cleanupInterval = setInterval(() => {
      setEuros(prev => prev.filter(euro => Date.now() - euro.timestamp < 5000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <div className="relative w-full min-h-[100px] overflow-hidden bg-gradient-to-tr from-primary via-red-800 to-orange-900 rounded-t-xl">
      {/* Falling euros */}
      {euros.map(euro => (
        <div
          key={euro.id}
          className="absolute text-yellow-400 animate-fall pointer-events-none"
          style={{
            left: `${euro.left}%`,
            transform: `rotate(${euro.angle}deg)`,
            fontSize: `${euro.size}px`,
            opacity: euro.opacity,
            animation: `fall ${euro.speed}s linear`,
          }}
        >
          €
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 text-center py-10">
        <h2 className="text-3xl font-bold text-white">Les Promos de <br /> Mémé Georgette</h2>
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

export default FallingEurosPromo;
