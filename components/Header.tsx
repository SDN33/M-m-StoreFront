'use client';

import { ShoppingCart, User, Menu as MenuIcon, X} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CartPopup from './CartPopup';
import SearchInput from './SearchInput';
import PromotionSection from './PromotionSection';

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'PROMOS', href: '/promos', className: 'text-primary font-semibold' },
    { name: '⚡ VENTES FLASH', href: '/ventes-flash', className: 'text-primary font-semibold' },
    { name: 'Découvrir Mémé Georgette', href: 'https://memegeorgette.com' },
    { name: 'Vins rouges', href: '/products/category/rouge' },
    { name: 'Vins blancs', href: '/products/category/blanc' },
    { name: 'Vins rosés', href: '/products/category/rose' },
    { name: 'Vins pétillants', href: '/products/category/petillant' },
    { name: 'Vins liquoreux', href: '/products/category/liquoreux' },
  ];

  const toggleCartPopup = () => {
    setIsCartOpen(!isCartOpen);
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary shadow">
      <PromotionSection />

      {/* Top Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3">
          {/* Desktop and Tablet View */}
          <div className="hidden md:flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 ml-8">
              <Image
                src="/images/logo3.png"
                alt="Logo"
                width={200}
                height={50}
              />
            </a>

            {/* Search Bar */}
            <SearchInput />

            {/* Right Actions */}
            <div className="flex items-center space-x-6 mr-3">
              <div className="hidden lg:flex items-center space-x-1 text-sm">
                <span className='text-white'>Livraison en</span>
                <Image
                  src="/images/fr.png"
                  alt="France"
                  width={20}
                  height={14}
                  className="mx-1"
                />
                <span className="font-bold text-white">France</span>
              </div>

              <a href=":" className="hidden lg:flex items-center text-sm text-white hover:text-primary">
                <User className="w-5 h-5 mr-1 text-white font-semibold" />
                <span className='text-white font-semibold' >Espace pro</span>
              </a>

              <a href="/faq" className="hidden lg:block text-sm text-white font-semibold hover:text-primary">
                Aide
              </a>

              <div className="flex items-center space-x-4">
                <a href="/login" className="text-sm text-white font-semibold hover:text-primary">
                  Se connecter
                </a>
                <a className="relative">
                  <ShoppingCart onClick={toggleCartPopup} className="w-6 h-6 text-white font-semibold" />
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
                src="/images/logo.svg"
                alt="Logo"
                width={100}
                height={32}
                className="h-12 w-auto"
              />
            </a>

            <a href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop and Tablet */}
      <nav className="hidden md:block bg-white shadow-lg">
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
      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Header;
