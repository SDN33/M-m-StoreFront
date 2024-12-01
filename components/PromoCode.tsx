import { BadgeEuro, Snowflake } from "lucide-react";
import { useState, useEffect } from "react";


const PromoCode: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Écouteur pour détecter la sortie du curseur du haut de l'écran
      const handleMouseMove = (e: MouseEvent) => {
        if (e.clientY < 50) { // Si le curseur s'approche du haut de l'écran
          setIsVisible(true);
        }
      };

      const handleMouseLeave = () => {
        setIsVisible(false);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, 20000); // Démarre après 10 secondes

    return () => clearTimeout(timer);
  }, []);

  const snowflakes = [
    { left: "10%", animationDelay: "0s", opacity: 0.8, size: 30 },
    { left: "50%", animationDelay: "1s", opacity: 0.5, size: 15 },
    { left: "90%", animationDelay: "2s", opacity: 0.3, size: 10 },
    { left: "20%", animationDelay: "3s", opacity: 0.7, size: 20 },
    { left: "70%", animationDelay: "4s", opacity: 0.6, size: 25 },
    { left: "40%", animationDelay: "5s", opacity: 0.4, size: 12 },
    { left: "80%", animationDelay: "6s", opacity: 0.2, size: 8 },
    { left: "30%", animationDelay: "7s", opacity: 0.9, size: 22 },
    { left: "60%", animationDelay: "8s", opacity: 0.5, size: 18 },
    { left: "0%", animationDelay: "9s", opacity: 0.6, size: 25 },
  ];

  return (
    <div
      className={` shadow-xl -mt-8 bg-primary border-teal/80 border-4 p-4 w-fit h-fit fixed bottom-4 right-4 z-50 transform transition-all duration-500 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      style={{
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isVisible && !isHovered ? (
        <div style={{ textAlign: "center", color: "#fff" }}>
          {/* Flocons de neige animés */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {snowflakes.map((flake, index) => (
              <div
                key={index}
                className="absolute snowflake"
                style={{
                  left: flake.left,
                  animationDelay: flake.animationDelay,
                  opacity: flake.opacity,
                }}
              >
                <Snowflake size={flake.size} color="white" className="opacity-30 animate-fall" />
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {snowflakes.map((flake, index) => (
              <div
                key={index}
                className="absolute snowflake"
                style={{
                  left: flake.left,
                  animationDelay: flake.animationDelay,
                  opacity: flake.opacity,
                }}
              >
                <Snowflake size={flake.size} color="white" className="opacity-30 animate-fall" />
              </div>
            ))}
          </div>
            <div className="border-t-4 border-white w-8 mx-auto mb-2" />
            <div className="flex justify-center">
              <BadgeEuro />
            </div>
            <h3><span style={{ fontWeight: "bold" }}>PROMO DES FETES</span></h3>
            <p className="pt-1" style={{ fontSize: "14px" }}><strong className="text-xl font-gray-950">meme10</strong> <br />-10% sur votre première commande <br /> (dès 50€ d&apos;achat)</p>
        </div>
      ) : null}
    </div>
  );
};

export default PromoCode;
