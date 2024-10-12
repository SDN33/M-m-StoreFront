"use client";
import React from "react";
import { CreditCard } from "lucide-react";
import Newsletter from "./Newletter";
import Image from "next/image";


const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-2 text-center">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section principale */}
        <div className="mb-12">
          <Image
            src="/images/logo.png"
            alt="Logo Mémé Georgette"
            className="mb-6 mx-auto"
            width={160}
            height={120}
          />
          <Newsletter />
          <br />

          <p className="text-sm font-light mb-8">
            Nous avons à cœur de partager notre passion pour les vins bio et biodynamiques. <br />
            Notre cave coopérative s&apos;engage à proposer des vins authentiques,
            en privilégiant les circuits courts et le respect de la nature.
          </p>
        </div>

        {/* Grille de navigation centrée */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div>
            <h3 className="text-orange-600 font-semibold mb-4">À propos de Mémé Georgette</h3>
            <ul className="space-y-2">
              <li><a href="/concept" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Le concept</a></li>
              <li><a href="/demarche" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Notre Démarche</a></li>
              <li><a href="/actualites" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">On parle de nous !</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-orange-600 font-semibold mb-4">Découvrez nos vins</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Les rouges</a></li>
              <li><a href="/" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Les blancs</a></li>
              <li><a href="/" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Les rosés</a></li>
              <li><a href="/" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Les pétillants</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-orange-600 font-semibold mb-4">Besoin d&apos;aide ?</h3>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Questions fréquentes</a></li>
              <li><a href="/contact" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Nous contacter</a></li>
              <li><a href="/cgv" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">CGV</a></li>
              <li><a href="/mentions-legales" className="text-gray-800 hover:text-orange-600 transition-colors text-sm">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        {/* Logos de paiement */}
        <div className="flex justify-center items-center space-x-4">
          <Image src="/images/visa.png" alt="Visa" width={30} height={30} />
          <Image src="/images/mastercard.png" alt="Mastercard" width={30} height={30} />
          <Image src="/images/paypal.png" alt="PayPal" width={50} height={50}  />
          <div className="flex items-center text-gray-600">
            <CreditCard className="h-4 w-4 mr-1 text-black" />
            <span className="text-xs text-black">Paiement sécurisé</span>
          </div>
        </div>

        {/* Mentions légales et copyright */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-800 mb-4 font-light">
            L&apos;abus d&apos;alcool est dangereux pour la santé, sachez consommer avec modération.
            Interdiction de vente de boissons alcooliques aux mineurs de -18 ans.
          </p>
          <p className="text-xs text-gray-800 font-light">
            © 2024 Les Vins de Mémé Georgette, tous droits réservés
            <br />Création de <a className="font-bold" href="https://stillinov.com">Still-inov Agency</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
