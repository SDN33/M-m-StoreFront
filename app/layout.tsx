// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Analytics } from "@vercel/analytics/react"
import Cookies from "@/components/Cookies";


type TwitterMetadata = {
  card: string;
  title: string;
  description: string;
  images: { url: string; alt: string }[];
};


export const metadata: Metadata & { twitter: TwitterMetadata } = {
  title: "Les vins de Mémé Georgette | 2 500 vins Bio en direct de vignerons et vigneronnes engagé(e)s | Vins Bio et Biodynamie Démeter",
  description:
    "Plongez dans l’univers du vin bio, où chaque gorgée raconte une histoire de passion et de respect pour la nature. Contrairement aux idées reçues, choisir un vin bio n’est pas synonyme de prix élevé. En effet, nous vous proposons une sélection de vins d'exception à des prix abordables, tout en garantissant un impact environnemental minimal.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["Mémé Georgette, Vins Mémé Georgette, acheter vins, vinatis, les grappes, vin en ligne, acheter vins bio, acheter vins en ligne, vins bio, vins en ligne, vins naturels, vins biodynamiques, vins pas chers, vins de qualité, vins de vignerons, vins de vigneronnes, vins de France, vins du monde, vins rouges, vins blancs, vins rosés, vins pétillants, vins effervescents, vins tranquilles, vins de garde, vins de cépages, vins de terroir, vins de caractère, vins de gastronomie, vins de fête, vins de tous les jours, vins de qualité, vins de prestige, vins de collection, vins de garde, vins de Bordeaux, vins de Bourgogne, vins de Loire, vins de Rhône, vins de Provence, vins de Champagne, vins d'Alsace, vins du Languedoc, vins du Roussillon, vins du Sud-Ouest, vins du Jura, vins de Savoie, vins de Corse, vins d'Espagne, vins d'Italie, vins d'Allemagne, vins du Portugal"],
  openGraph: {
    title: "Les vins de Mémé Georgette | 2 500 vins Bio en direct de vignerons et vigneronnes engagé(e)s | Vins Bio et Biodynamie Démeter",
    description:
      "Plongez dans l’univers du vin bio, où chaque gorgée raconte une histoire de passion et de respect pour la nature. Contrairement aux idées reçues, choisir un vin bio n’est pas synonyme de prix élevé. En effet, nous vous proposons une sélection de vins d'exception à des prix abordables, tout en garantissant un impact environnemental minimal.",
    images: [
      {
        url: "/images/post_partage.png",
        width: 800,
        height: 600,
        alt: "banner les vins de Mémé Georgette",
      },
    ],
    siteName: "Les vins de Mémé Georgette",
  },
  twitter: {
    card: "summary_large_image",
    title: "Les vins de Mémé Georgette | 2 500 vins Bio en direct de vignerons et vigneronnes engagé(e)s  | Vins Bio et Biodynamie Démeter",
    description:
      "Plongez dans l’univers du vin bio, où chaque gorgée raconte une histoire de passion et de respect pour la nature. Contrairement aux idées reçues, choisir un vin bio n’est pas synonyme de prix élevé. En effet, nous vous proposons une sélection de vins d'exception à des prix abordables, tout en garantissant un impact environnemental minimal.",
    images: [
      {
        url: "/images/post_partage.png",
        alt: "banner Les Vins de Mémé Georgette",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta property="og:image" content="https://vinsmemegeorgette.com/images/post_partage.png" />
        <meta property="og:title" content={metadata.openGraph?.title as string} />
        <meta property="og:description" content={metadata.openGraph?.description as string} />
        <meta property="og:url" content="https://vinsmemegeorgette.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content={metadata.twitter?.card} />
        <meta name="twitter:title" content={metadata.twitter?.title} />
        <meta name="twitter:description" content={metadata.twitter?.description} />
        <meta name="twitter:image" content={metadata.twitter?.images[0].url} />
        <link rel="icon" href="https://memegeorgette.com/app/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <AgeVerificationModal />
            <Cookies />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
