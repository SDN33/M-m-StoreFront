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

            {/* Right Actions - Updated spacing */}
            <div className="hidden lg:flex items-center space-x-8 text-sm px-6">
              {/* Delivery section */}
              <div className="flex items-center space-x-3">
                <span className="text-white">Livraison en</span>

                <div className="flex items-center space-x-2">
                  <span className="flex items-center space-x-1 text-white">
                    {selectedCountry.name}
                    <Image
                      src={selectedCountry.imgSrc}
                      alt={selectedCountry.name}
                      width={30}
                      height={14}
                      className="ml-2 flex-shrink-0"
                    />
                  </span>
                  <ChevronDown
                    className="w-4 h-4 text-white cursor-pointer hover:text-gray-200"
                    onClick={toggleLanguageMenu}
                  />
                </div>
              </div>

              {/* Language Menu */}
              {isLanguageMenuOpen && (
                <ul className="absolute mt-32 bg-white border border-gray-300 rounded-md shadow-lg z-40">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                    onClick={() => handleCountrySelect('France', '/images/fr.png')}
                  >
                    <span>France</span>
                    <Image
                      src="/images/fr.png"
                      alt="France"
                      width={30}
                      height={14}
                      className="flex-shrink-0"
                    />
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                    onClick={() => handleCountrySelect('Europe', '/images/euro.png')}
                  >
                    <span>Europe</span>
                    <Image
                      src="/images/euro.png"
                      alt="Europe"
                      width={30}
                      height={14}
                      className="flex-shrink-0"
                    />
                  </li>
                </ul>
              )}

              {/* Pro Portal Link */}
              <a
                href="/portailpro"
                className="hidden lg:flex items-center text-sm hover:text-gray-200 transition-colors"
              >
                <span className="font-semibold text-white">Portail Pro</span>
              </a>

              {/* Help Link */}
              <a
                href="/faq"
                className="text-white hidden lg:block text-sm font-semibold hover:text-gray-200 transition-colors"
              >
                Aide
              </a>

              {/* Auth and Cart */}
              <div className="flex items-center space-x-6">
                <AuthButton />
                <CartIcon onClick={toggleCartPopup} />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="flex md:hidden items-center justify-between">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>

            <a href="/" className="flex-shrink-0">
              <Image
                src="/images/logomemeg2.png"
                alt="Logo"
                width={100}
                height={32}
                className="h-12 w-auto"
              />
            </a>
            <CartIcon onClick={toggleCartPopup} />
          </div>
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

          <ul className="scrollable-menu flex items-center space-x-4 lg:space-x-8 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <li
                key={category.name}
                className="whitespace-nowrap font-bold hover-animate text-sm"
              >
                <a
                  href={category.href}
                  className={`px-3 py-4 text-gray-900 hover:text-primary transition-colors block ${category.className || ''}`}
                  onClick={category.onClick}
                >
                  {category.name}
                  {category.icon && category.icon}
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
            className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50"
            onClick={() => setIsNosVinsOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 mx-4 lg:w-3/4 lg:mx-auto">
              <h2 className="text-xl font-bold mb-4">Nos Vins</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vinsSubCategories.map((subCategory) => (
                  <li key={subCategory.name}>
                    <a href={subCategory.href} className="block relative rounded-md overflow-hidden aspect-video">
                      <Image
                        src={subCategory.backgroundImage}
                        alt={subCategory.name}
                        layout="fill"
                        objectFit="cover"
                      />
                      <span className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center text-white font-semibold text-lg">
                        {subCategory.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
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
