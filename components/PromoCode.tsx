import { BadgeEuro } from "lucide-react";
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
    }, 10000); // Démarre après 10 secondes

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={` shadow-xl -mt-8 bg-primary p-4 w-fit h-fit fixed bottom-4 right-4 z-50 transform transition-all duration-500 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
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
          <div className="border-t-4 border-white w-8 mx-auto mb-2" />
          <BadgeEuro />
          <h3><span style={{ fontWeight: "black" }}>PROMO DES FETES -10%</span></h3>
          <p className="pt-1" style={{ fontSize: "14px" }}><strong className="text-xl font-black text-red-800">meme10</strong> <br />sur votre première commande <br /> (dès 50€ d&apos;achat)</p>
        </div>
      ) : null}
    </div>
  );
};

export default PromoCode;
