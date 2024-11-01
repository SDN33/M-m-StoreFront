'use client';

import { User, Menu as MenuIcon, X, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CartPopup from './CartPopup';
import SearchInput from './SearchInput';
import PromotionSection from './PromotionSection';
import AuthButton from './AuthButton';
import CartIcon from './CartIcon';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNosVinsOpen, setIsNosVinsOpen] = useState(false);

  const toggleNosVinsPopup = () => {
    setIsNosVinsOpen((prev) => !prev);
  };

  const categories = [
    { name: 'PROMOS', href: '/promos', className: 'text-primary font-semibold' },
    { name: '⚡ VENTES FLASH', href: '/ventes-flash', className: 'text-primary font-semibold' },
    { name: 'Nos Vins', onClick: toggleNosVinsPopup, icon: <ChevronDown className="inline-block ml-1" /> },
    { name: 'Découvrir Mémé Georgette', href: 'https://memegeorgette.com' },
    { name: 'Nos Vignerons.nes', href: '/vendors' },
    { name: 'Vins du Monde', href: '/vins-du-monde' },
    { name: 'Contactez-nous', href: '/contact' },
  ];



  const vinsSubCategories = [
    { name: 'Rouge', href: '/vins/rouge', backgroundImage: '/images/red-wine-bg.jpg' },
    { name: 'Blanc', href: '/vins/blanc', backgroundImage: '/images/white-wine-bg.jpg' },
    { name: 'Rosé', href: '/vins/rose', backgroundImage: '/images/rose-wine-bg.jpg' },
    { name: 'Pétillant', href: '/vins/petillant', backgroundImage: '/images/sparkling-wine-bg.jpg' },
    { name: 'Liquoreux', href: '/vins/liquoreux', backgroundImage: '/images/dessert-wine-bg.jpg' },
    { name: 'Autres', href: '/vins/autres', backgroundImage: '/images/other-wine-bg.jpg' },
  ];


  const toggleCartPopup = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-xl">
      <PromotionSection />

      {/* Top Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-1">
          {/* Desktop and Tablet View */}
          <div className="hidden md:flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 ml-8">
              <Image
                src="/images/memelogo2.png"
                alt="Logo"
                width={200}
                height={250}
                quality={100}
                className="py-2"

              />
            </a>

            {/* Search Bar */}
            <SearchInput />

            {/* Right Actions */}
            <div className="flex items-center space-x-6 mr-3">
              <div className="hidden lg:flex items-center space-x-1 text-sm">
                <span className='text-black'>Livraison en</span>
                <Image
                  src="/images/fr.png"
                  alt="France"
                  width={20}
                  height={14}
                  className="mx-1"
                />
                <span className="font-bold text-black">France</span>
              </div>

              <a href="https://portailpro-memegeorgette.com" className="hidden lg:flex items-center text-sm hover:text-primary">
                <User className="w-5 h-5 -mt-1 font-semibold" />
                <span className="font-semibold ml-1">Portail Pro</span>
              </a>

              <a href="/faq" className="hidden lg:block text-sm font-semibold hover:text-primary">
                Aide
              </a>

              <div className="flex items-center space-x-4">
                <AuthButton/>
                <CartIcon onClick={toggleCartPopup}/>
                {/* <a className="relative">
                  <ShoppingCart onClick={toggleCartPopup} className="w-6 h-6 hover:text-primary font-semibold cursor-pointer" />
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </a> */}
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

            {/* <a href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-black" />
              <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </a> */}
            <CartIcon onClick={toggleCartPopup}/>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop and Tablet */}
      <nav className="hidden md:block bg-white shadow-xl relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Icone de gauche */}
          <ChevronLeft className="w-6 h-6 text-primary cursor-pointer hover-animate" onClick={() => {
            const scrollContainer = document.querySelector('.scrollable-menu');
            if (scrollContainer) {
              scrollContainer.scrollBy({ left: -150, behavior: 'smooth' });
            }
          }} />

          <ul className="scrollable-menu flex items-center space-x-4 lg:space-x-8 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <li
                key={category.name}
                className="whitespace-nowrap font-bold hover-animate text-sm"
              >
                <a
                  href={category.href}
                  className={`px-3 py-4 text-gray-900 hover:text-primary block ${category.className || ''}`}
                  onClick={category.onClick}
                >
                  {category.name}
                  {category.icon && category.icon}
                </a>
              </li>
            ))}
          </ul>

          <ChevronRight className="w-6 h-6 text-primary cursor-pointer hover-animate" onClick={() => {
            const scrollContainer = document.querySelector('.scrollable-menu');
            if (scrollContainer) {
              scrollContainer.scrollBy({ left: 150, behavior: 'smooth' });
            }
          }} />
        </div>
      </nav>

      {/* Overlay et Popup modale pour Nos Vins */}
      {isNosVinsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={toggleNosVinsPopup}
          ></div>
          <div
            className="fixed z-50 inset-0 flex items-center justify-center p-4"
          >
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-96 max-h-180 overflow-y-auto">
              <button className="absolute top-2 right-2" onClick={toggleNosVinsPopup}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-lg font-bold mb-4 text-primary">Nos Vins</h2>

              {/* Vignettes des catégories de vin */}
              <div className="grid grid-cols-2 gap-4">
                {vinsSubCategories.map((subcategory) => (
                  <div
                    key={subcategory.name}
                    className="relative rounded-lg overflow-hidden shadow-md cursor-pointer"
                    style={{
                      backgroundImage: `url(${subcategory.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100px', // Hauteur des vignettes
                    }}
                  >
                    <a href={`/products/category/${subcategory.name.toLowerCase()}`} className="absolute inset-0 flex items-center justify-center text-white font-bold bg-black bg-opacity-30 hover:bg-opacity-40 transition duration-300">
                      {subcategory.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}


      {/* Popup Panier */}
      {isCartOpen && <CartPopup isOpen={isCartOpen} onClose={toggleCartPopup} />}
    </div>
  );
};

export default Header;
