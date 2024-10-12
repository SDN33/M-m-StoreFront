import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgeVerificationModal from "@/components/AgeVerificationModal";

export const metadata: Metadata = {
  title: "Les vins de Mémé Georgette | Cave Coopérative Engagée | Vins Bio et Démeter",
  description:
    "Plongez dans l’univers du vin bio, où chaque gorgée raconte une histoire de passion et de respect pour la nature. Contrairement aux idées reçues, choisir un vin bio n’est pas synonyme de prix élevé. En effet, nous vous proposons une sélection de vins d'exception à des prix abordables, tout en garantissant un impact environnemental minimal.",
  icons: {
    icon: "/favicon.ico",
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
        <AgeVerificationModal />
        <Header />
        <main className="flex-grow ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
