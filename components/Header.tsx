'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

// Hook personnalisé pour détecter la taille d'écran
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVinsMenuOpen, setIsVinsMenuOpen] = useState(false);
  const [bgColor, setBgColor] = useState('bg-black bg-opacity-80'); // Fond noir par défaut
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Utilisation du hook pour détecter si l'écran est mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isHomePage) {
      const handleScroll = () => {
        const currentScroll = window.scrollY;

        // Gérer le fond du header selon la taille d'écran et la position du scroll
        if (isMobile || currentScroll > 0) {
          setBgColor('bg-black bg-opacity-80');
        } else {
          setBgColor('bg-transparent');
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setBgColor('bg-black bg-opacity-80'); // Toujours noir sur les autres pages
    }
  }, [isHomePage, isMobile]);

  return (
    <header className={`fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-8 ${bgColor} transition-colors duration-600 z-20`}>
      {/* Left Navigation */}
      <nav className="hidden md:flex items-center space-x-8 ml-10 font-semibold">
        <a href="/" className="relative text-white hover:text-orange-600 font-semibold">Accueil</a>

        {/* Dropdown for 'Nos Vins' */}
        <div className="relative">
          <button
            className="relative text-white hover:text-orange-600 font-semibold flex items-center"
            onClick={() => setIsVinsMenuOpen(!isVinsMenuOpen)}
          >
            Nos Vins
            <ChevronDown className="ml-2 w-4 h-4" />
          </button>

          {isVinsMenuOpen && (
            <ul className="absolute mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
              <li><a href="/products/category/rouge" className="block px-4 py-2 text-sm text-gray-800 hover:bg-orange-600">Nos vins rouges</a></li>
              <li><a href="/products/category/blanc" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">Nos vins blancs</a></li>
              <li><a href="/products/category/rose" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">Nos vins rosés</a></li>
              <li><a href="/products/category/petillant" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">Nos vins pétillants</a></li>
              <li><a href="/products/category/liquoreux" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">Nos vins liquoreux</a></li>
            </ul>
          )}
        </div>

        <a href="https://www.memegeorgette.com/" className="relative text-white hover:text-orange-600 font-semibold">Découvrir Mémé Georgette</a>
        <a href="/contact" className="relative text-white hover:text-orange-600 font-semibold">Contact</a>
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
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un vin..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-800"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-6 h-6" />
        </div>

        <div className="relative">
          <button
            className="text-white hover:text-gray-800 focus:outline-none"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <User className="w-6 h-6" />
          </button>

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

        <a href="/cart" className="relative">
          <ShoppingCart className="w-6 h-6 text-white" />
        </a>
      </div>

      {/* Mobile Menu */}
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white p-4 rounded-md shadow-lg z-30 transition-all duration-300 ease-in-out">
          <a href="/" className="block py-2 text-gray-800">Accueil</a>
          <a href="https://www.memegeorgette.com/" className="block py-2 text-gray-800">Découvrir Mémé Georgette</a>
          <a href="/products" className="block py-2 text-gray-800">Nos Vins</a>
          <a href="/contact" className="block py-2 text-gray-800">Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;
