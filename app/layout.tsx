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
  title: "Vins Bio et Biodynamiques - 2 500 Références de Vins - Mémé Georgette",
  description:
    "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
  icons: {
    icon: "/favicon.ico"
  },
  keywords: ["Mémé Georgette, meme georgette,  Vins Mémé Georgette, acheter vins, vinatis, les grappes, vin en ligne, acheter vins bio, achat vins en ligne, vins bio, vins en ligne, vins sans sulfites, vins nature, acheter vins eu, vins biodynamiques, vivino, vins de qualité, vinatis, vins de vigneronnes, vins de France, vins du monde, vins rouges, vins blancs, vins rosés, vins pétillants, vins effervescents, vins tranquilles, vins de garde, cépages, terroir français, vins de caractère, vins de gastronomie, vins de fête, vins de qualité, vins de prestige, vins de collection, vins de garde, vins de Bordeaux, vins de Bourgogne, vins de Loire, vins de Rhône, vins de Provence, vins de Champagne, vins d'Alsace, vins du Languedoc, vins du Roussillon, vins du Sud-Ouest, vins du Jura, vins de Savoie, vins de Corse, vins d'Espagne, vins d'Italie, vins d'Allemagne, vins du Portugal, vinaigre, wu, aoc, bouteille crémant prix  "],
  openGraph: {
    title: "Vins Bio et Biodynamiques - 2 500 Références de Vins - Mémé Georgette",
    description:
      "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
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
    title: "Achat Vins Bio et Biodynamiques - Rouge, Blanc, Rosé, Pétillant",
    description:
      "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
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
        <meta property="og:site_name" content={metadata.openGraph?.siteName} />
        <meta property="og:locale" content="fr_FR" />
        <meta name="icon" content="/favicon.ico" />
        <meta name="author" content="Vins Mémé Georgette" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />

        <meta name="twitter:card" content={metadata.twitter?.card} />
        <meta name="twitter:title" content={metadata.twitter?.title} />
        <meta name="twitter:description" content={metadata.twitter?.description} />
        <meta name="twitter:image" content={metadata.twitter?.images[0].url} />
        <link rel="icon" href="https://memegeorgette.com/app/favicon.ico" type="image/x-icon" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Store",
            "name": "Vins Mémé Georgette",
            "url": "https://www.vinsmemegeorgette.com",
            "logo": "https://www.vinsmemegeorgette.com/memelogo2.png",
            "description": "Vins bio et biodynamiques en direct des vignerons engagés",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Coubeyrac",
              "addressRegion": "Dordogne",
              "postalCode": "24000",
              "addressCountry": "FR"
            },
          })}
        </script>
              </head>
              <body>
                <AuthProvider>
                  <CartProvider>
                    <Header />
                    <AgeVerificationModal />
                    <Cookies />
                    {children}
                  </CartProvider>
                </AuthProvider>
                <Analytics />
                <Footer  />
              </body>
            </html>
          );
}
