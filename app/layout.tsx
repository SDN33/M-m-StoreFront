import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Cookies from "@/components/Cookies";
import Script from "next/script";



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
