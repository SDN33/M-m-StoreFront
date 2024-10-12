'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bgColor, setBgColor] = useState('bg-black bg-opacity-60'); // Fond noir transparent par défaut pour mobile

  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (isMobile) {
        // Sur mobile, garder le fond noir transparent
        setBgColor('bg-black bg-opacity-60');
      } else {
        // Sur desktop, changer la couleur en fonction du défilement
        if (currentScroll > 0) {
          setBgColor('bg-black bg-opacity-60'); // Couleur sombre au défilement
        } else {
          setBgColor('bg-transparent'); // Couleur claire en haut de page
        }
      }
    };

    // Appliquer le comportement de scroll seulement sur la page d'accueil
    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (isHomePage) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isHomePage, isMobile]);

  return (
    <header className={`fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-8 ${bgColor} transition-colors duration-600 z-20`}>
      {/* Left Navigation */}
      <nav className="hidden md:flex items-center space-x-8 ml-10 font-semibold">
        <a href="/" className="relative text-white hover:text-orange-500 font-semibold">
          Accueil
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
        </a>
        <a href="/products" className="relative text-white hover:text-orange-500 font-semibold">
          Nos Vins
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
        </a>
        <a href="/about" className="relative text-white hover:text-orange-500 font-semibold">
          Découvrir Mémé Georgette
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
        </a>
        <a href="/contact" className="relative text-white hover:text-orange-500 font-semibold">
          Contact
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
        </a>
      </nav>

      {/* Center Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <a href="/" className="flex items-center">
          <Image
            src="/images/logo3.svg"
            alt="Logo Mémé Georgette"
            width={180}
            height={60}
          />
        </a>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex items-center space-x-6 mr-10">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un vin..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-800"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
        </div>

        {/* User Account */}
        <div className="relative">
          <button
            className="text-white hover:text-gray-800 focus:outline-none"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <User className="w-6 h-6" />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
              {isLoggedIn ? (
                <>
                  <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">Mon Dashboard</a>
                  <button onClick={() => setIsLoggedIn(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">Se Déconnecter</button>
                </>
              ) : (
                <>
                  <a href="/login" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">Se Connecter</a>
                  <a href="/register" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">S&apos;inscrire</a>
                </>
              )}
            </div>
          )}
        </div>

        {/* Shopping Cart */}
        <a href="/cart" className="relative">
          <ShoppingCart className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white p-4 rounded-md shadow-lg z-30">
          <a href="/" className="block py-2 text-gray-800">Accueil</a>
          <a href="/products" className="block py-2 text-gray-800">Nos Vins</a>
          <a href="/about" className="block py-2 text-gray-800">Mémé Georgette se présente</a>
          <a href="/contact" className="block py-2 text-gray-800">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;
