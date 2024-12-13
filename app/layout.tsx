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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=0.9, maximum-scale=0.9, user-scalable=no" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Store",
            "name": "Vins Mémé Georgette",
            "url": "https://www.vinsmemegeorgette.com",
            "logo": "https://www.vinsmemegeorgette.com/memelogo2.png",
            "description": "Vins bio et biodynamiques en direct des vignerons engagés",
            "address": {
              "addressCountry": "FR",
              "addressLocality": "Saurel",
              "addressRegion": "Aquitaine",
              "postalCode": "33890",
              "streetAddress": "Saurel",
            },
          })}
        </script>

        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://d13sozod7hpim.cloudfront.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ucarecdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://d13sozod7hpim.cloudfront.net" />
        <link rel="dns-prefetch" href="https://ucarecdn.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Brevo Conversations Widget */}
        <Script
          id="brevo-script"
          strategy="afterInteractive"
        >
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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RSNYNCZTC4"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RSNYNCZTC4', {
              'page_path': location.pathname
            });
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
