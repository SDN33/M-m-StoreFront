"use client";
import React from "react";
import { CreditCard } from "lucide-react";
import Image from "next/image";


const Footer = () => {
  return (
    <footer id="footer" className="bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 shadow-lg text-white py-4 text-center overflow-y-hidden">

      <div className="max-w-7xl mx-auto px-4">
        {/* Logos de paiement */}
        <div className="flex justify-center items-center space-x-4 w-fit h-auto mx-auto mb-8 bg-white rounded-lg p-2">
          <a href="https://www.visa.fr" title="Visa">
            <Image
              src="/images/visa.png"
              alt="Visa"
              height={30}
              width={30}
              sizes="30"
            />
          </a>
          <a href="https://www.mastercard.fr" title="mastercard" aria-label="Mastercard">
            <Image
              src="/images/mastercard.png"
              alt="Mastercard"
              height={30}
              width={30}
            />
          </a>
          <a href="https://stripe.com/fr" title="Stripe" aria-label="Stripe">
            <Image
              src="/images/stripe.webp"
              alt="Stripe"
              height={50}
              width={30}
            />
          </a>
          <div className="flex items-center text-gray-600">
            <CreditCard className="h-4 w-4 mr-1 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600">Paiement sécurisé</span>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-12 mt-4 max-w-4xl mx-auto text-white">
          <div>
            <h3 className=" font-semibold mb-4 text-lg lg:text-xl text-white">À propos de Mémé...</h3>
            <ul className="space-y-2 font-normal">
              <li><a href="https://www.memegeorgette.com/" title="Site Mémé Georgette" className=" hover:text-primary transition-colors text-sm">Découvrir Mémé Georgette</a></li>
              <li><a href="/portailpro" title="Portail Pro Mémé Georgette" className=" hover:text-primary transition-colors text-sm">Portail Pro</a></li>
              <li><a href="/blog" title="Blog Vins Mémé Georgette" className=" hover:text-primary transition-colors text-sm">Le Blog de Mémé</a></li>
              <li><a href="/vignerons" title="Vignerons Mémé Georgette" className=" hover:text-primary transition-colors text-sm">Nos Vignerons</a></li>
              <li><a href="/promos" title="Promo Vins Mémé Georgette" className=" hover:text-primary transition-colors text-sm">Promos</a></li>
            </ul>
          </div>

          <div>
            <h3 className=" font-semibold mb-4 text-lg lg:text-xl text-white">Découvrez nos vins</h3>
            <ul className="space-y-2 font-normal">
              <li><a href="/vins/rouge" className="text-white hover:text-primary transition-colors text-sm">Nos Vins Rouges</a></li>
              <li><a href="/vins/blanc" className="text-white hover:text-primary transition-colors text-sm">Nos Vins Blancs</a></li>
              <li><a href="/vins/rose" className="text-white hover:text-primary transition-colors text-sm">Nos Vins Rosés</a></li>
              <li><a href="/vins/petillant" className="text-white hover:text-primary transition-colors text-sm">Nos Vins Pétillants</a></li>
              <li><a href="/vins/liquoreux"className="text-white hover:text-primary transition-colors text-sm">Nos Vins Liquoreux</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg lg:text-xl text-white">Besoin d&apos;aide ?</h3>
            <ul className="space-y-2 font-normal">
              <li><a href="/contact" className="text-white hover:text-primary transition-colors text-sm">Nous contacter</a></li>
              <li><a href="/faq" className="text-white hover:text-primary transition-colors text-sm">FAQ (Foire aux questions)</a></li>
              <li><a href="/mentions-legales" className="text-white hover:text-primary transition-colors text-sm">Mentions légales</a></li>
              <li><a href="/cgv" className="text-white hover:text-primary transition-colors text-sm">CGV</a></li>
            </ul>
          </div>
        </div>

        {/* Mentions légales et copyright */}
        <div className=" -mb-2">
          <Image src="/images/image-restriction.svg" alt="Prévention Alcool" width={500} height={500} className="mb-4 mx-auto w-500 h-auto" />
          <p className="text-xs text-white mb-4 font-normal">
            L&apos;abus d&apos;alcool est dangereux pour la santé, sachez consommer avec modération.
            Interdiction de vente de boissons alcooliques aux mineurs de -18 ans.
            <br />Éthylotest, en vente <a className="underline decoration-white hover:decoration-primary" href="https://www.norauto.fr/c/47996-ethylotest.html" title="Éthylotest Norauto">ici</a>
          </p>
          <p className="text-xs text-white mb-4 font-normal">Participer à notre cagnotte Litchee <a className="underline" href="https://www.norauto.fr/c/47996-ethylotest.html">Vignerons En Difficulté</a></p>
          <p className="font-normal text-white text-xs">
            © 2024 - Mémé Georgette, tous droits réservés
            <br />Création de <a className="font-bold text-primary" title="Site Still-inov Agency" href="https://stillinov.com">Still-inov Agency</a>
          </p>
          <br />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
