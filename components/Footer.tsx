import React from "react";
import { Facebook, Instagram } from "lucide-react"; // Assurez-vous d'importer les icônes nécessaires

const Footer = () => {
  return (
    <footer className="bg-white text-primary py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <img src="/images/logo2.png" alt="Logo Mémé Georgette" className="w-40 h-auto mb-1" />
            <p className="mt-2 sloganhero">
              Savourez les meilleurs vins bio à la Cave Coopérative Les Vins de
              Mémé Georgette.<br /> Explorez notre catalogue de vins certifiés Demeter
              et découvrez l'authenticité du terroir français.
            </p>
          </div>

          <div className="mb-6 md:mb-0 sloganhero">
            <h3 className="text-lg font-semibold">Liens utiles</h3>
            <ul className="mt-2">
              <li>
                <a href="/vins" className="hover:text-orange-800">Nos Vins</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-800">Contact</a>
              </li>
              <li>
                <a href="/politique-de-vente" className="hover:text-orange-800">Politique de vente</a>
              </li>
              <li>
                <a href="/mentions-legales" className="hover:text-orange-800">Mentions légales</a>
              </li>
              <li>
                <a href="/politique-de-retour" className="hover:text-orange-800">Politique de retour</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold sloganhero">Réseaux sociaux</h3>
            <div className="flex space-x-4 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-800">
                <Facebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-800">
                <Instagram />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center font-semibold">
          <p>© 2024 Les Vins de Mémé Georgette. Tous droits réservés.</p>
          <p>Design par Still-inov Agency</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
