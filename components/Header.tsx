'use client';

import { ShoppingCart, User, Menu as MenuIcon, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import CartPopup from './CartPopup';
import SearchInput from './SearchInput';
import PromotionSection from './PromotionSection';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNosVinsOpen, setIsNosVinsOpen] = useState(false);



  const toggleNosVinsPopup = () => {
    setIsNosVinsOpen(!isNosVinsOpen);
  };

  const categories = [
    { name: 'PROMOS', href: '/promos', className: 'text-primary font-semibold' },
    { name: '⚡ VENTES FLASH', href: '/ventes-flash', className: 'text-primary font-semibold' },
    { name: 'Découvrir Mémé Georgette', href: 'https://memegeorgette.com' },
    { name: 'Nos Vins', className: 'text-primary font-semibold', onClick: toggleNosVinsPopup },
    { name: 'Nos Vignerons.nes', href: '/vignerons' },
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

  // Fermeture du popup en cliquant en dehors
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('.nos-vins-modal') === null) {
      setIsNosVinsOpen(false);
    }
  };

  useEffect(() => {
    if (isNosVinsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNosVinsOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xl">
      <PromotionSection />

      {/* Top Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
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

              <a href=":" className="hidden lg:flex items-center text-sm hover:text-primary">
                <User className="w-5 h-5 mr-1 font-semibold" />
                <span className='font-semibold ml-1'>Espace pro</span>
              </a>

              <a href="/faq" className="hidden lg:block text-sm font-semibold hover:text-primary">
                Aide
              </a>

              <div className="flex items-center space-x-4">
                <a href="/login" className="text-sm font-semibold hover:text-primary">
                  Se connecter
                </a>
                <a className="relative">
                  <ShoppingCart onClick={toggleCartPopup} className="w-6 h-6 text-black font-semibold cursor-pointer" />
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
      <nav className="hidden md:block bg-white shadow-xl">
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-4 lg:space-x-8 overflow-x-auto">
            {categories.map((category) => (
              <li key={category.name} className="whitespace-nowrap font-bold">
                <a
                  href={category.href}
                  className={`px-3 py-4 text-gray-900 hover:text-primary block ${category.className || ''}`}
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Popup modale pour Nos Vins */}
      {isNosVinsOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-20">
          <div className="bg-white p-4 rounded-lg shadow-xl w-96 h-80 overflow-y-auto nos-vins-modal relative">
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
      )}

      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Header;
