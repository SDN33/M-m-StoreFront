'use client';

import { Menu as MenuIcon, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CartPopup from './CartPopup';
import SearchInput from './SearchInput';
import PromotionSection from './PromotionSection';
import AuthButton from './AuthButton';
import CartIcon from './CartIcon';
import Link from 'next/link';

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
    setIsMenuOpen(false);
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
    { name: 'PROMOS', href: '/promos', className: 'text-red-700 font-semibold' },
{ name: 'Nos Vins', onClick: toggleNosVinsPopup, icon: <ChevronDown className={` inline-block ml-1 w-4 h-4 transition-transform ${isNosVinsOpen ? 'rotate-180' : ''}`} /> },
    { name: 'Découvrir Mémé Georgette', href: 'https://memegeorgette.com' },
    { name: 'Nos Vignerons.nes', href: '/vendors' },
    { name: 'Vins du Monde', href: '/vins-du-monde' },
    { name: 'Contactez-nous', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ];

  const vinsSubCategories = [
    {
      name: (
        <>
          <span className="text-lg">Rouge<br />
            <span className="text-xs">Parfait pour les viandes rouges, les plats en sauce et les fromages</span>
          </span>
        </>
      ),
      href: '/vins/rouge',
      background: 'bg-gradient-to-br from-red-900 via-red-800 to-red-700'
    },
    {
      name: (
        <>
          <span className="text-lg">Blanc<br />
            <span className="text-xs">Idéal avec les poissons, fruits de mer et volailles</span>
          </span>
        </>
      ),
      href: '/vins/blanc',
      background: 'bg-gradient-to-br from-yellow-100 via-yellow-150 to-yellow-200'
    },
    {
      name: (
        <>
          <span className="text-lg">Rosé<br />
            <span className="text-xs">Excellent pour l&apos;apéritif, les grillades et la cuisine méditerranéenne</span>
          </span>
        </>
      ),
      href: '/vins/rose',
      background: 'bg-gradient-to-br from-pink-300 via-pink-400 to-pink-600'
    },
    {
      name: (
        <>
          <span className="text-lg">Pétillant<br />
            <span className="text-xs">Pour célébrer ou accompagner vos desserts</span>
          </span>
        </>
      ),
      href: '/vins/petillant',
      background: 'bg-gradient-to-br from-yellow-200 via-amber-50 to-amber-100'
    },
    {
      name: (
        <>
          <span className="text-lg">Liquoreux<br />
            <span className="text-xs">Sublime avec le foie gras et les desserts</span>
          </span>
        </>
      ),
      href: '/vins/liquoreux',
      background: 'bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-300'
    },
    {
      name: (
        <>
          <span className="text-lg">Autres<br />
            <span className="text-xs">Découvrez nos autres vins d&apos;exception</span>
          </span>
        </>
      ),
      href: '/vins/autres',
      background: 'bg-gradient-to-br from-teal-500 via-teal-450 to-teal-400'
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-primary shadow-sm">
      {/* PromotionSection avec hauteur fixe */}
      <div className="h-[30px]">
        <PromotionSection />
      </div>

      {/* Top Header - Hauteur fixe */}
      <div className="border-b bg-primary pt-4">
        <div className="container mx-auto px-4">
          {/* Desktop and Tablet View - Hauteur fixe */}
          <div className="hidden lg:flex items-center justify-between h-16 relative">
            {/* Container des logos avec dimensions fixes */}
            <div className="relative w-[280px] h-32 flex items-center">
              <div className="absolute left-0 top-0 h-full w-[71px] flex items-center justify-center">
                <Link href="/">
                  <Image
                    src="/images/meme-pas-contente.png"
                    alt="Logo"
                    width={71}
                    height={90}
                    className="transform scale-x-[-1] scale-110 object-contain"
                    priority
                  />
                </Link>
              </div>

              <div className="absolute left-16 h-full w-[210px] flex items-center justify-center">
                <Link href="/">
                  <Image
                    src="/images/memelogo.png"
                    alt="Logo"
                    width={210}
                    height={90}
                    className="object-contain"
                    priority
                  />
                </Link>
              </div>
            </div>

            {/* Search Bar - Largeur fixe */}
            <div className="flex-grow max-w-2xl mx-8">
              <SearchInput />
            </div>

            {/* Right Actions - Largeur fixe */}

            <div className="hidden md:hidden lg:flex items-center space-x-7 text-sm px-4 min-w-[400px] justify-end my-auto">
              <div className="flex items-center space-x-3">
                <span className="text-white whitespace-nowrap">Livraison en</span>
                <div className="relative">
                  <button
                    onClick={toggleLanguageMenu}
                    className="flex items-center text-white hover:text-gray-200"
                  >
                    <div className="w-[40px] h-[20px] relative">
                      <Image
                        src={selectedCountry.imgSrc}
                        alt={selectedCountry.name}
                        layout="fill"
                        className="object-contain"
                      />
                    </div>
                    <span>{selectedCountry.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLanguageMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-52 z-50">
                      {[
                        { name: 'France', imgSrc: '/images/fr.png' },
                        { name: 'Europe', imgSrc: '/images/euro.png' }
                      ].map((country) => (
                        <button
                          key={country.name}
                          onClick={() => handleCountrySelect(country.name, country.imgSrc)}
                          className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative w-[30px] h-[30px]">
                            <Image
                              src={country.imgSrc}
                              alt={country.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span>{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <a href="/portailpro" className="text-white hover:text-black font-semibold whitespace-nowrap">
                Portail Pro
              </a>
              <a href="/faq" className="text-white hover:text-black font-semibold whitespace-nowrap">
                Aide
              </a>
              <AuthButton />
              <CartIcon onClick={toggleCartPopup} />
            </div>
          </div>

          {/* Mobile View - Hauteur fixe */}
          <div className="flex lg:hidden items-center justify-between h-20 mt-3 md:-mt-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-gray-200"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

            <div className="relative h-50 w-60 flex items-center justify-center scale-110 mx-auto my-auto">
              <Link href="/">
                <Image
                  src="/images/memelogo.png"
                  alt="Logo"
                  width={200}
                  height={100}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            <div className="flex items-center space-x-2 mt-1">
              <CartIcon onClick={toggleCartPopup} />
            </div>
          </div>

          {/* Mobile Menu - Position absolue pour ne pas affecter la hauteur du header */}
          {isMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl z-50">
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
                    <div className="relative w-[30px] h-[14px]">
                      <Image
                        src={selectedCountry.imgSrc}
                        alt={selectedCountry.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{selectedCountry.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

                <nav className="border-t border-gray-100">
                <AuthButton />

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

      {/* Navigation Bar - Desktop and Tablet - Hauteur fixe */}
      <nav className="hidden sm:min-w-sm md:hidden lg:flex xl:flex bg-white shadow-xl relative h-12">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <ul className="scrollable-menu flex items-center justify-center space-x-4 lg:space-x-8 overflow-x-auto no-scrollbar h-full mx-4 flex-grow">
            {categories.map((category) => (
              <li
                key={category.name}
                className="whitespace-nowrap font-bold hover-animate text-sm h-full flex items-center"
              >
                <a
                  href={category.href}
                  onClick={category.onClick}
                  className={`px-0 text-gray-900 hover:text-primary transition-colors flex items-center h-full ${
                    category.className || ''
                  }`}
                >
                  {category.name}
                  {category.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>


      {/* Nos Vins Popup */}
      {isNosVinsOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50 md:flex sm:hidden lg:flex"
            onClick={() => setIsNosVinsOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:flex sm:hidden rounded-2xl">
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
                    <li
                      key={subCategory.href}
                      className="transform transition-transform duration-200 hover:scale-105"
                    >
                      <a
                        href={subCategory.href}
                        className="block relative rounded-lg overflow-hidden aspect-video group"
                      >
                        <div className={`relative w-full h-full ${subCategory.background} transition-transform duration-300 group-hover:scale-110`} />
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
    </header>
  );
};

export default Header;
