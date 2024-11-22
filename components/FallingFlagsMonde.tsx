import React, { useEffect, useState } from 'react';

const FallingFlagsPromo = () => {
  // Liste de codes de drapeaux emoji
  const flags = React.useMemo(() => ["🇵🇹", "🇪🇸", "🇮🇹", "🇩🇪"], []);

  interface Flag {
    id: string;
    left: number;
    angle: number;
    size: number;
    opacity: number;
    speed: number;
    timestamp: number;
    flag: string;
  }

  const [fallingFlags, setFallingFlags] = useState<Flag[]>([]);

  useEffect(() => {
    const createFlag = () => {
      const newFlag = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        left: Math.random() * 100,
        angle: Math.random() * 360,
        size: Math.random() * (30 - 20) + 20,
        opacity: Math.random() * (1 - 0.6) + 0.6,
        speed: Math.random() * (12 - 8) + 8,
        timestamp: Date.now(),
        flag: flags[Math.floor(Math.random() * flags.length)]
      };
      setFallingFlags(prev => [...prev, newFlag]);
    };

    // Créer de nouveaux drapeaux périodiquement
    const interval = setInterval(createFlag, 300);

    // Supprimer les drapeaux qui sont tombés après 5 secondes
    const cleanupInterval = setInterval(() => {
      setFallingFlags(prev => prev.filter(flag => Date.now() - flag.timestamp < 5000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [flags]);

  return (
    <div className="relative w-full min-h-[100px] overflow-hidden bg-gradient-to-r from-teal-200 to-teal-400 rounded-t-xl">
      {/* Drapeaux qui tombent */}
      {fallingFlags.map(flag => (
        <div
          key={flag.id}
          className="absolute animate-fall pointer-events-none"
          style={{
            left: `${flag.left}%`,
            transform: `rotate(${flag.angle}deg)`,
            fontSize: `${flag.size}px`,
            opacity: flag.opacity,
            animation: `fall ${flag.speed}s linear`,
          }}
        >
          {flag.flag}
        </div>
      ))}

      {/* Contenu superposé */}
      <div className="relative z-10 text-center py-10">
        <h2 className="text-3xl font-bold text-white">Les Promos de Mémé Georgette</h2>
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

export default FallingFlagsPromo;
