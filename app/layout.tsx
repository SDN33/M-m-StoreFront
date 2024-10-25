// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "les vins de Mémé Georgette | 2 500 vins bio en direct de vignerons et vigneronnes engagé(e)s | Vins Bio et Biodynamie Démeter",
  description:
    "Plongez dans l’univers du vin bio, où chaque gorgée raconte une histoire de passion et de respect pour la nature. Contrairement aux idées reçues, choisir un vin bio n’est pas synonyme de prix élevé. En effet, nous vous proposons une sélection de vins d'exception à des prix abordables, tout en garantissant un impact environnemental minimal.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["vin bio", "vin biodynamie", "Mémé Georgette", "vin sans sulfites", "vin vegan", "vin bio pas cher", "vin bio en ligne", "vin bio livraison gratuite", "Les vins de Mémé Georgette", "vin bio sans sulfites ajoutés", "vin bio sans sulfites", "acheter vins", "vins en ligne", "vins pas cher", "vins livraison gratuite", "vins sans alcool", "vins sans sulfites ajoutés", "vins sans sulfites", "vins vegan", "vins naturels", "vins biodynamie", "vins bio en ligne", "vins bio pas cher", "vins bio livraison gratuite"],
  openGraph: {
    title: "les vins de Mémé Georgette | 2 500 vins bio en direct de vignerons et vigneronnes engagé(e)s | Vins Bio et Biodynamie Démeter",
    description:
      "Plongez dans l’univers du vin bio, où chaque gorgée raconte une histoire de passion et de respect pour la nature. Contrairement aux idées reçues, choisir un vin bio n’est pas synonyme de prix élevé. En effet, nous vous proposons une sélection de vins d'exception à des prix abordables, tout en garantissant un impact environnemental minimal.",
    images: [
      {
        url: "/images/Bannermeta.png",
        width: 800,
        height: 600,
        alt: "banner les vins de Mémé Georgette",
      },
    ],
    siteName: "les vins de Mémé Georgette",
  },
  twitter: {
    card: "summary_large_image",
    title: "les vins de Mémé Georgette | 2 500 vins bio en direct de vignerons et vigneronnes engagé(e)s  | Vins Bio et Biodynamie Démeter",
    description:
      "Plongez dans l’univers du vin bio, où chaque gorgée raconte une histoire de passion et de respect pour la nature. Contrairement aux idées reçues, choisir un vin bio n’est pas synonyme de prix élevé. En effet, nous vous proposons une sélection de vins d'exception à des prix abordables, tout en garantissant un impact environnemental minimal.",
    images: [
      {
        url: "/images/Bannermeta.png",
        alt: "banner Les Vins de Mémé Georgette",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <AgeVerificationModal />
        {children}
        <Footer />
      </body>
    </html>
  );
};
