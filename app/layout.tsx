import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header"; // Vérifiez que le chemin est correct
import Footer from "../components/Footer"; // Vérifiez que le chemin est correct
import PromotionSection from "@/components/PromotionSection";
import AgeVerificationModal from "@/components/AgeVerificationModal";

export const metadata: Metadata = {
  title: "Les vins de Mémé Georgette | Cave Coopérative Engagée | Vins Bio et Démeter",
  description:
    "Plongez dans l’univers du vin bio, où chaque gorgée raconte une histoire de passion et de respect pour la nature. Contrairement aux idées reçues, choisir un vin bio n’est pas synonyme de prix élevé. En effet, nous vous proposons une sélection de vins d'exception à des prix abordables, tout en garantissant un impact environnemental minimal.",
  icons: {
    icon: "/favicon.ico", // Utilisez un chemin relatif pour le favicon
  }, // Fermeture correcte de l'objet metadata
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AgeVerificationModal /> {/* Inclusion de la fenêtre modale */}
        <PromotionSection /> {/* Inclusion de la bannière promotionnelle */}
        <Header /> {/* Inclusion du Header */}
        <main className="flex-grow ">{children}
        </main>
        <Footer /> {/* Inclusion du Footer */}
      </body>
    </html>
  );
}
