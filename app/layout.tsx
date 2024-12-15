import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Cookies from "@/components/Cookies";
import Script from "next/script";

export function generateCustomMetadata(options: {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraphImage?: { url: string; width?: number; height?: number; alt?: string };
}) {
  const {
    title = "ACHAT VIN BIO, BIODYNAMIQUE, SANS SULFITES - Mémé Georgette",
    description = "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
    keywords = [],
    openGraphImage = {
      url: "/images/post_partage.webp",
      width: 800,
      height: 600,
      alt: "bannière les vins de Mémé Georgette"
    }
  } = options;

  return {
    title,
    alternates: {
      canonical: "https://vinsmemegeorgette.com"
    },
    description,
    icons: {
      icon: "/favicon.ico"
    },
    keywords: [
      ...["Mémé Georgette", "meme georgette", "Vins Mémé Georgette", "acheter vin", "vinatis", "les grappes", "vin en ligne", "acheter vins bio", "achat vins en ligne", "vins bio", "vins en ligne", "vins sans sulfites", "vins nature", "acheter vins eu", "vins biodynamiques", "vivino"],
      ...keywords
    ],
    openGraph: {
      title,
      description,
      images: [openGraphImage],
      siteName: "Les vins de Mémé Georgette",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{
        url: openGraphImage.url,
        alt: openGraphImage.alt || "bannière Les Vins de Mémé Georgette"
      }]
    }
  };
}

export const metadata = generateCustomMetadata({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
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
