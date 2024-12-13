import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez-nous | Vins Mémé Georgette",
  description: "Contactez-nous pour toute question sur nos vins biologiques et biodynamiques. Notre équipe est à votre disposition pour vous conseiller.",
  openGraph: {
    title: "Contact | VinsMemGeorgette.com",
    description: "Contactez-nous pour toute question sur nos vins biologiques et biodynamiques. Notre équipe est à votre disposition pour vous conseiller.",
    images: [
      {
        url: "/images/nos-vins.webp",
        width: 800,
        height: 600,
        alt: "Collection de vins Mémé Georgette"
      }
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Vins Mémé Georgette",
    description: "Contactez-nous pour toute question sur nos vins biologiques et biodynamiques. Notre équipe est à votre disposition pour vous conseiller.",
    images: ["/images/nos-vins.webp"],
  },
  keywords: [
    "contact vins bio",
    "contact vins biodynamiques",
    "vins naturels contact",
    "Mémé Georgette contact",
    "contact caviste bio"
  ],
  alternates: {
    canonical: "https://vinsmemegeorgette.com/contact"
  }
};
