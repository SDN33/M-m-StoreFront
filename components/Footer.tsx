"use client";
import React from "react";
import { CreditCard } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start gap-8">
          {/* Navigation links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-base text-primary">À propos</h3>
              <ul className="space-y-1 font-normal text-black">
                <li><a href="https://www.memegeorgette.com/" className="hover:text-primary transition-colors text-sm">Découvrir Mémé Georgette</a></li>
                <li><a href="/demarche" className="hover:text-primary transition-colors text-sm">Notre Démarche</a></li>
                <li><a href="/actualites" className="hover:text-primary transition-colors text-sm">On parle de nous !</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-base text-primary">Nos vins</h3>
              <ul className="space-y-1 font-normal">
                <li><a href="/products/category/rouge" className="text-black hover:text-primary transition-colors text-sm">Les rouges</a></li>
                <li><a href="/products/category/blanc" className="text-black hover:text-primary transition-colors text-sm">Les blancs</a></li>
                <li><a href="/products/category/rose" className="text-black hover:text-primary transition-colors text-sm">Les rosés</a></li>
                <li><a href="/products/category/petillant" className="text-black hover:text-primary transition-colors text-sm">Les pétillants</a></li>
                <li><a href="/products/category/liquoreux" className="text-black hover:text-primary transition-colors text-sm">Les liquoreux</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-base text-primary">Aide</h3>
              <ul className="space-y-1 font-normal">
                <li><a href="/contact" className="text-black hover:text-primary transition-colors text-sm">Nous contacter</a></li>
                <li><a href="/faq" className="text-black hover:text-primary transition-colors text-sm">FAQ</a></li>
                <li><a href="/mentions-legales" className="text-black hover:text-primary transition-colors text-sm">Mentions légales</a></li>
                <li><a href="/cgv" className="text-black hover:text-primary transition-colors text-sm">CGV</a></li>
              </ul>
            </div>
          </div>

          {/* Logo et paiement à droite */}
          <div className="flex flex-col items-center space-y-4 flex-shrink-0 order-first md:order-last">
            <Image
              src="/images/logow.png"
              alt="Logo Mémé Georgette"
              width={150}
              height={45}
              className="mb-2"
            />
            {/* Moyens de paiement */}
            <div className="flex items-center space-x-3">
              <a href="https://www.visa.fr">
                <Image src="/images/visa.png" alt="Visa" width={25} height={25} />
              </a>
              <a href="https://www.mastercard.fr">
                <Image src="/images/mastercard.png" alt="Mastercard" width={25} height={25} />
              </a>
              <a href="https://www.paypal.com">
                <Image src="/images/paypal.png" alt="PayPal" width={40} height={40} />
              </a>
              <div className="flex items-center text-gray-600">
                <CreditCard className="h-3 w-3 mr-1 text-black" />
                <span className="text-xs font-semibold text-gray-800">Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mentions légales et copyright en bas */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Image
            src="/images/image-restriction.svg"
            alt="Prévention Alcool"
            width={400}
            height={40}
            className="mb-3 mx-auto"
          />
          <div className="text-center">
            <p className="text-xs text-black mb-2 font-normal">
              L&apos;abus d&apos;alcool est dangereux pour la santé, sachez consommer avec modération.
              Interdiction de vente de boissons alcooliques aux mineurs de -18 ans.
            </p>
            <p className="font-normal text-black text-xs">
              © 2024 Les Vins de Mémé Georgette, © Mémé Georgette, tous droits réservés
              <span className="mx-1">•</span>
              Création de <a className="font-bold text-primary" href="https://stillinov.com">Still-inov Agency</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
