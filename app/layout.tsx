import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Cookies from "@/components/Cookies";
import Script from "next/script";

type TwitterMetadata = {
  card: string;
  title: string;
  description: string;
  images: { url: string; alt: string }[];
};

export const metadata: Metadata & { twitter: TwitterMetadata } = {
  title: "ACHAT VIN BIO, BIODYNAMIQUE, SANS SULFITES - Mémé Georgette",
  alternates: {
    canonical: "https://vinsmemegeorgette.com"
  },
  description:
    "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
  icons: {
    icon: "/favicon.ico"
  },
  keywords: [
    "Mémé Georgette, meme georgette, Vins Mémé Georgette, acheter vin, vinatis, les grappes, vin en ligne, acheter vins bio, achat vins en ligne, vins bio, vins en ligne, vins sans sulfites, vins nature, acheter vins eu, vins biodynamiques, vivino, vins de qualité, vinatis, vins de vigneronnes, vins de France, vins du monde, vins rouges, vins blancs, vins rosés, vins pétillants, vins effervescents, vins tranquilles, vins de garde, cépages, terroir français, vins de caractère, vins de gastronomie, vins de fête, vins de qualité, vins de prestige, vins de collection, vins de garde, vins de Bordeaux, vins de Bourgogne, vins de Loire, vins de Rhône, vins de Provence, vins de Champagne, vins d'Alsace, vins du Languedoc, vins du Roussillon, vins du Sud-Ouest, vins du Jura, vins de Savoie, vins de Corse, vins d'Espagne, vins d'Italie, vins d'Allemagne, vins du Portugal, vinaigre, wu, aoc, bouteille crémant prix"
  ],
  openGraph: {
    title: "ACHAT VIN BIO, BIODYNAMIQUE, SANS SULFITES - Mémé Georgette",
    description:
      "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
    images: [
      {
        url: "/images/post_partage.webp",
        width: 800,
        height: 600,
        alt: "bannière les vins de Mémé Georgette",
      },
    ],
    siteName: "Les vins de Mémé Georgette",

  },
  twitter: {
    card: "summary_large_image",
    title: "ACHAT VIN BIO, BIODYNAMIQUE, SANS SULFITES - Mémé Georgette",
    description:
      "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
    images: [
      {
        url: "/images/post_partage.webp",
        alt: "bannière Les Vins de Mémé Georgette",
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
        <meta name="viewport" content="width=device-width, initial-scale=0.90" />
      <script type="application/ld+json">
          {JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Store",
        "name": "Vins Mémé Georgette",
        "url": "https://www.vinsmemegeorgette.com",
        "logo": "https://www.vinsmemegeorgette.com/memelogo2.png",
        "description": "Vins bio et biodynamiques en direct des vignerons engagés",
        "address": {
          "addressCountry": "FR"
        },
          })}
        </script>
        <script src="https://cdn.brevo.com/js/sdk-loader.js" async></script>
        <Script id="brevo-init" strategy="afterInteractive">
            {`
            window.Brevo = window.Brevo || [];
            window.Brevo.push([
                "init",
                {
                    "clientKey": "${process.env.NEXT_PUBLIC_BREVO_CLIENT_KEY}",
                }
            ]);
            `}
        </Script>
        {/* Preconnect to CloudFront */}
        <link rel="preconnect" href="https://d13sozod7hpim.cloudfront.net" crossOrigin="anonymous" />

        {/* Preconnect to ucarecdn */}
        <link rel="preconnect" href="https://ucarecdn.com" crossOrigin="anonymous" />

        {/* Preconnect to Cloudinary */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />

        {/* Optional: DNS Prefetch if you don't need full connection, just DNS resolution */}
        <link rel="dns-prefetch" href="https://d13sozod7hpim.cloudfront.net" />
        <link rel="dns-prefetch" href="https://ucarecdn.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        <Script id="brevo-script" strategy="afterInteractive">
          {`
        (function(d, w, c) {
            w.BrevoConversationsID = '6749ff2ae7addbe4dd00599a';
            w[c] = w[c] || function() {
            (w[c].q = w[c].q || []).push(arguments);
            };
            var s = d.createElement('script');
            s.async = true;
            s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
            if (d.head) d.head.appendChild(s);
        })(document, window, 'BrevoConversations');
          `}
        </Script>

      </head>
      <body>
        <AuthProvider>
            <CartProvider>
            <Header />
            <AgeVerificationModal aria-label="Vérification de l'âge" aria-modal="true" />
            <Cookies aria-label="Consentement des cookies" aria-modal="true"/>
            {children}
            </CartProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
