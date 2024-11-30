import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Analytics } from "@vercel/analytics/react";
import Cookies from "@/components/Cookies";
import Script from "next/script";

type TwitterMetadata = {
  card: string;
  title: string;
  description: string;
  images: { url: string; alt: string }[];
};

export const metadata: Metadata & { twitter: TwitterMetadata } = {
  title: "Achat Vin Bio et Démeter Biodynamie | 2 500 vins Bio | Mémé Georgette",
  description:
    "Découvrez notre sélection de vin bio et biodynamie démeter. Plus de 2500 vins en direct de vignerons engagés.",
  icons: { icon: "/favicon.ico" },
  keywords: ["vins bio", "achat vin", "vin nature", "vins sans sulfites"],
  openGraph: {
    title: "Achat Vin Bio et Démeter Biodynamie | 2 500 vins Bio | Mémé Georgette",
    description:
      "Découvrez notre sélection de vin bio et biodynamie démeter.",
    images: [{ url: "/images/post_partage.png", width: 800, height: 600, alt: "Mémé Georgette" }],
    siteName: "Les vins de Mémé Georgette",
  },
  twitter: {
    card: "summary_large_image",
    title: "Achat Vin Bio et Démeter Biodynamie | 2 500 vins Bio | Mémé Georgette",
    description:
      "Découvrez notre sélection de vin bio et biodynamie démeter.",
    images: [{ url: "/images/post_partage.png", alt: "Mémé Georgette" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Vins Mémé Georgette" />
        <meta name="icon" content={metadata.icons ? '/favicon.ico' : undefined} />
        <meta property="og:locale" content="fr_FR" />
        <link rel="icon" href="https://memegeorgette.com/app/favicon.ico" />

        {/* Open Graph & Twitter */}
        <meta property="og:title" content={metadata.openGraph?.title?.toString() ?? metadata.title?.toString()} />
        <meta property="og:description" content={metadata.openGraph?.description?.toString() ?? metadata.description?.toString()} />
        <meta property="og:image" content="https://vinsmemegeorgette.com/images/post_partage.png" />
        <meta property="og:url" content="https://vinsmemegeorgette.com" />

        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0].url} />

        {/* Preload image */}
        <link rel="preload" href="/images/post_partage.png" as="image" />
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

        {process.env.YOTPO_APP_KEY && (
          <Script
            id="yotpo-widget-script"
            src={`https://staticw2.yotpo.com/${process.env.YOTPO_APP_KEY}/widget.js`}
            strategy="afterInteractive"
          />
        )}

        {process.env.YOTPO_APP_KEY && (
          <Script
            id="yotpo-tracking-script"
            strategy="afterInteractive"
          >
            {`(function(){window.yotpoTrackPageView = function() { if (window.yotpo && window.yotpo.track) { window.yotpo.track('pageView'); }}; window.yotpoTrackPageView();})();`}
          </Script>
        )}
      </body>
    </html>
  );
}
