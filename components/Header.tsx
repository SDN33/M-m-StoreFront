'use client';

import { ShoppingCart, User, Menu as MenuIcon, X, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CartPopup from './CartPopup';
import SearchInput from './SearchInput';
import PromotionSection from './PromotionSection';

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
    { name: 'La Sélection de Mémé', href: '/selection-meme' },
    { name: 'Nos Vignerons.nes', href: '/vendors' },
    { name: 'Vins du Monde', href: '/vins-du-monde' },
    { name: 'Contactez-nous', href: '/contact' },
  ];

  const vinsSubCategories = [
    { name: 'Vins rouges', href: '/products/category/rouge' },
    { name: 'Vins blancs', href: '/products/category/blanc' },
    { name: 'Vins rosés', href: '/products/category/rose' },
    { name: 'Vins pétillants', href: '/products/category/petillant' },
    { name: 'Vins liquoreux', href: '/products/category/liquoreux' },
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
                src="/images/logow.png"
                alt="Logo"
                width={140}
                height={50}
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
                <User className="w-5 h-5 mr-1 font-semibold" />
                <span className="font-semibold ml-1">Portail Pro</span>
              </a>

              <a href="/faq" className="hidden lg:block text-sm font-semibold hover:text-primary">
                Aide
              </a>

              <div className="flex items-center space-x-4">
                <a href="/login" className="text-sm font-semibold hover:text-primary">
                  Se connecter
                </a>
                <a className="relative">
                  <ShoppingCart onClick={toggleCartPopup} className="w-6 h-6 hover:text-primary font-semibold cursor-pointer" />
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    0
                  </span>
                </a>
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
                src="/images/logow.png"
                alt="Logo"
                width={100}
                height={32}
                className="h-12 w-auto"
              />
            </a>

            <a href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-black" />
              <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </a>
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
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-96 max-h-80 overflow-y-auto">
              <button className="absolute top-2 right-2" onClick={toggleNosVinsPopup}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-lg font-bold mb-4 text-primary">Nos Vins</h2>
              <ul>
                {vinsSubCategories.map((subcategory) => (
                  <li key={subcategory.name} className="py-2">
                    <a href={subcategory.href} className="text-gray-700 hover:text-primary">
                      {subcategory.name}
                    </a>
                  </li>
                ))}
              </ul>
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
