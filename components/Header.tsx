'use client';

import { Menu as MenuIcon, X, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CartPopup from './CartPopup';
import SearchInput from './SearchInput';
import PromotionSection from './PromotionSection';
import AuthButton from './AuthButton';
import CartIcon from './CartIcon';

interface Country {
  name: string;
  imgSrc: string;
}

const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isNosVinsOpen, setIsNosVinsOpen] = useState<boolean>(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: 'France',
    imgSrc: '/images/fr.png',
  });

  const toggleNosVinsPopup = () => {
    setIsNosVinsOpen((prev) => !prev);
    setIsMenuOpen(false); // Ferme le menu mobile si ouvert
  };

  const toggleCartPopup = () => {
    setIsCartOpen((prev) => !prev);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen((prev) => !prev);
  };

  const handleCountrySelect = (name: string, imgSrc: string) => {
    setSelectedCountry({ name, imgSrc });
    setIsLanguageMenuOpen(false);
  };

  const categories = [
    { name: 'PROMOS', href: '/promos', className: 'text-primary font-semibold' },
    { name: '⚡ VENTES FLASH', href: '/ventes-flash', className: 'text-primary font-semibold' },
    { name: 'Nos Vins', onClick: toggleNosVinsPopup, icon: <ChevronDown className="inline-block ml-1" /> },
    { name: 'Découvrir Mémé Georgette', href: 'https://memegeorgette.com' },
    { name: 'Nos Vignerons.nes', href: '/vendors' },
    { name: 'Vins du Monde', href: '/vins-du-monde' },
    { name: 'Contactez-nous', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ];

  const vinsSubCategories = [
    { name: 'Rouge', href: '/vins/rouge', backgroundImage: '/images/cat1.png' },
    { name: 'Blanc', href: '/vins/blanc', backgroundImage: '/images/cat2.png' },
    { name: 'Rosé', href: '/vins/rose', backgroundImage: '/images/cat3.png' },
    { name: 'Pétillant', href: '/vins/petillant', backgroundImage: '/images/cat4.png' },
    { name: 'Liquoreux', href: '/vins/liquoreux', backgroundImage: '/images/cat5.png' },
    { name: 'Autres', href: '/vins/autres', backgroundImage: '/images/cat6.png' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-primary shadow-sm">
      <PromotionSection />

       {/* Top Header */}
       <div className="border-b">
        <div className="container mx-auto px-4 py-1">
          {/* Desktop and Tablet View */}
          <div className="hidden md:flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <Image
                src="/images/meme-pas-contente.png"
                alt="Logo"
                width={71}
                height={90}
                quality={100}
                className="absolute left-0 top-12 transform scale-x-[-1]"
              />
            </a>

            <a href="/" className="flex-shrink-0 ml-8">
              <Image
                src="/images/memelogo.png"
                alt="Logo"
                width={210}
                height={250}
                quality={100}
                className="py-2 -ml-8 scale-110"
              />
            </a>


            {/* Search Bar */}
            <div className="flex-grow max-w-2xl mx-8">
              <SearchInput />
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-8 text-sm px-6">
              <div className="flex items-center space-x-3">
                <span className="text-white">Livraison en</span>
                <div className="relative">
                  <button
                    onClick={toggleLanguageMenu}
                    className="flex items-center space-x-2 text-white hover:text-gray-200"
                  >
                    <Image
                      src={selectedCountry.imgSrc}
                      alt={selectedCountry.name}
                      width={30}
                      height={14}
                      className="inline-block"
                    />
                    <span>{selectedCountry.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown amélioré */}
                  {isLanguageMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-48 z-50">
                      {[
                        { name: 'France', imgSrc: '/images/fr.png' },
                        { name: 'Europe', imgSrc: '/images/euro.png' }
                      ].map((country) => (
                        <button
                          key={country.name}
                          onClick={() => handleCountrySelect(country.name, country.imgSrc)}
                          className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                        >
                          <Image
                            src={country.imgSrc}
                            alt={country.name}
                            width={30}
                            height={14}
                          />
                          <span>{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <a href="/portailpro" className="text-white hover:text-gray-200 font-semibold">
                Portail Pro
              </a>
              <a href="/faq" className="text-white hover:text-gray-200 font-semibold">
                Aide
              </a>
              <AuthButton />
              <CartIcon onClick={toggleCartPopup} />
            </div>
          </div>

          {/* Mobile View - Amélioré */}
          <div className="flex md:hidden items-center justify-between py-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-gray-200"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <Image
                src="/images/meme-pas-contente.png"
                alt="Logo"
                width={71}
                height={71}
                quality={100}
                className="absolute left-0 top-12 transform scale-x-[-1]"
                layout="intrinsic" // ou "responsive" si tu veux que l'image soit redimensionnée dynamiquement
              />
            </a>

            <a href="/" className="flex-shrink-0">
              <Image
                src="/images/logomemeg2.png"
                alt="Logo"
                width={32}
                height={32}
                layout="intrinsic" // ou "responsive" si tu veux que l'image soit redimensionnée dynamiquement

              />
            </a>

            <div className="flex items-center space-x-2">
              <AuthButton />
              <CartIcon onClick={toggleCartPopup} />
            </div>
          </div>

          {/* Mobile Menu - Amélioré */}
          {isMenuOpen && (
            <div className="md:hidden bg-white absolute left-0 right-0 top-full border-t border-gray-100 shadow-xl">
              <div className="p-4">
                <SearchInput />
              </div>

              <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span>Livraison en</span>
                  <button
                    onClick={toggleLanguageMenu}
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src={selectedCountry.imgSrc}
                      alt={selectedCountry.name}
                      width={30}
                      height={14}
                    />
                    <span>{selectedCountry.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <nav className="border-t border-gray-100">
                {categories.map((category) => (
                  <a
                    key={category.name}
                    href={category.href}
                    onClick={category.onClick}
                    className={`block px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors ${
                      category.className || ''
                    }`}
                  >
                    {category.name}
                    {category.icon}
                  </a>
                ))}
              </nav>

              <div className="border-t border-gray-100 p-4 space-y-2">
                <a href="/portailpro" className="block py-2 text-gray-900 hover:text-primary">
                  Portail Pro
                </a>
                <a href="/faq" className="block py-2 text-gray-900 hover:text-primary">
                  Aide
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Bar - Desktop and Tablet */}
      <nav className="hidden md:block bg-white shadow-xl relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <ChevronLeft
            className="w-6 h-6 text-black cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              const scrollContainer = document.querySelector('.scrollable-menu');
              if (scrollContainer) {
                scrollContainer.scrollBy({ left: -150, behavior: 'smooth' });
              }
            }}
          />

          <ul className="scrollable-menu flex items-center space-x-4 lg:space-x-8 overflow-x-auto no-scrollbar py-2">
            {categories.map((category) => (
              <li
                key={category.name}
                className="whitespace-nowrap font-bold hover-animate text-sm"
              >
                <a
                  href={category.href}
                  onClick={category.onClick}
                  className={`px-3 py-4 text-gray-900 hover:text-primary transition-colors block ${
                    category.className || ''
                  }`}
                >
                  {category.name}
                  {category.icon}
                </a>
              </li>
            ))}
          </ul>

          <ChevronRight
            className="w-6 h-6 text-black cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              const scrollContainer = document.querySelector('.scrollable-menu');
              if (scrollContainer) {
                scrollContainer.scrollBy({ left: 150, behavior: 'smooth' });
              }
            }}
          />
        </div>
      </nav>

      {/* Nos Vins Popup */}
      {isNosVinsOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50"
            onClick={() => setIsNosVinsOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl mx-4 lg:w-3/4 lg:mx-auto relative max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <button
                  onClick={() => setIsNosVinsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>

                <h2 className="text-2xl font-bold mb-6">Nos Vins</h2>

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {vinsSubCategories.map((subCategory) => (
                    <li key={subCategory.name} className="transform transition-transform duration-200 hover:scale-105">
                      <a
                        href={subCategory.href}
                        className="block relative rounded-lg overflow-hidden aspect-video group"
                      >
                        <Image
                          src={subCategory.backgroundImage}
                          alt={subCategory.name}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 group-hover:from-black/70 group-hover:to-black/30 transition-all duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg text-center px-4 transform transition-transform duration-300 group-hover:scale-105">
                              {subCategory.name}
                            </span>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Popup */}
      {isCartOpen && <CartPopup isOpen={isCartOpen} onClose={toggleCartPopup} />}
    </div>
  );
};

export default Header;
