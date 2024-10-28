"use client";
import React from "react";
import { CreditCard } from "lucide-react";
import Image from "next/image";


const Footer = () => {
  return (
    <footer className="bg-white shadow-lg text-white py-2 text-center">

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Logos de paiement */}
        <div className="flex justify-center items-center space-x-4 w-fit mx-auto mb-8 ">
          <a href="https://www.visa.fr">
            <Image src="/images/visa.png" alt="Visa" width={30} height={30} />
          </a>
          <a href="https://www.mastercard.fr">
            <Image src="/images/mastercard.png" alt="Mastercard" width={30} height={30} />
          </a>
          <a href="https://www.paypal.com">
            <Image src="/images/paypal.png" alt="PayPal" width={50} height={50} />
          </a>
          <div className="flex items-center text-gray-600">
            <CreditCard className="h-4 w-4 mr-1 text-black" />
            <span className="text-xs font-semibold text-gray-800">Paiement sécurisé</span>
          </div>
        </div>

        {/* Grille de navigation centrée */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto text-black">
          <div>
            <h3 className=" font-semibold mb-4 text-lg text-primary">À propos de Mémé Georgette</h3>
            <ul className="space-y-2 font-normal">
              <li><a href="https://www.memegeorgette.com/" className=" hover:text-primary transition-colors text-sm">Découvrir Mémé Georgette</a></li>
              <li><a href="/demarche" className=" hover:text-primary transition-colors text-sm">Notre Démarche</a></li>
              <li><a href="/actualites" className=" hover:text-primary transition-colors text-sm">On parle de nous !</a></li>
            </ul>
          </div>

          <div>
            <h3 className=" font-semibold mb-4 text-lg text-primary">Découvrez nos vins</h3>
            <ul className="space-y-2 font-normal">
              <li><a href="/products/category/rouge" className="text-black hover:text-primary transition-colors text-sm">Les rouges</a></li>
              <li><a href="/products/category/blanc" className="text-black hover:text-primary transition-colors text-sm">Les blancs</a></li>
              <li><a href="/products/category/rose" className="text-black hover:text-primary transition-colors text-sm">Les rosés</a></li>
              <li><a href="/products/category/petillant" className="text-black hover:text-primary transition-colors text-sm">Les pétillants</a></li>
              <li><a href="/products/category/liquoreux"className="text-black hover:text-primary transition-colors text-sm">Les liquoreux</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg text-primary">Besoin d&apos;aide ?</h3>
            <ul className="space-y-2 font-normal">
              <li><a href="/contact" className="text-black hover:text-primary transition-colors text-sm">Nous contacter</a></li>
              <li><a href="/faq" className="text-black hover:text-primary transition-colors text-sm">FAQ (Foire aux questions)</a></li>
              <li><a href="/mentions-legales" className="text-black hover:text-primary transition-colors text-sm">Mentions légales</a></li>
              <li><a href="/cgv" className="text-black hover:text-primary transition-colors text-sm">CGV</a></li>
            </ul>
          </div>
        </div>

        {/* Mentions légales et copyright */}
        <div className="pt-4 -mb-2">
          <Image src="/images/image-restriction.svg" alt="Prévention Alcool" width={500} height={50} className="mb-4 mx-auto" />
          <p className="text-xs text-black mb-4 font-normal">
            L&apos;abus d&apos;alcool est dangereux pour la santé, sachez consommer avec modération.
            Interdiction de vente de boissons alcooliques aux mineurs de -18 ans.
          </p>
          <p className="font-normal text-black text-xs">
            © 2024 Les Vins de Mémé Georgette, © Mémé Georgette, tous droits réservés
            <br />Création de <a className="font-bold text-primary" href="https://stillinov.com">Still-inov Agency</a>
          </p>
          <br />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
