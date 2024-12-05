import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Analytics } from "@vercel/analytics/react";
import Cookies from "@/components/Cookies";
import Script from "next/script";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "ACHAT VIN BIO, BIODYNAMIQUE, SANS SULFITES - Mémé Georgette",
  description:
    "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
  keywords: [
    "Mémé Georgette, meme georgette, acheter vins bio, vins nature, vin en ligne"
  ],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "ACHAT VIN BIO, BIODYNAMIQUE, SANS SULFITES - Mémé Georgette",
    description:
      "Découvrez les vins bio et biodynamiques de Mémé Georgette : vins rouges, blancs, rosés, pétillants, liquoreux et sans sulfites",
    images: [{ url: "/images/post_partage.webp", width: 800, height: 600, alt: "banner les vins de Mémé Georgette" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        {/* Place ici la logique d'affichage des meta */}
        <Script id="brevo-script">
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
            <AgeVerificationModal />
            <Cookies />
            {children}
          </CartProvider>
        </AuthProvider>
        <Analytics />
        <BackToTop />
        <Footer />
      </body>
    </html>
  );
}
