'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVinsMenuOpen, setIsVinsMenuOpen] = useState(false);
  const [bgColor, setBgColor] = useState('bg-transparent');
  const [headerHeight, setHeaderHeight] = useState('h-24');
  const [logoSize, setLogoSize] = useState('w-44 h-auto');
  const [searchTerm, setSearchTerm] = useState('');

  interface Product {
    id: string;
    name: string;
  }

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (isHomePage) {
        if (currentScroll > 0) {
          setBgColor('bg-black bg-opacity-80');
          setHeaderHeight('h-16');
          setLogoSize('w-32 h-auto');
        } else {
          setBgColor('bg-transparent');
          setHeaderHeight('h-24');
          setLogoSize('w-44 h-auto');
        }
      } else if (pathname && pathname.startsWith('/product/')) {
        setBgColor('bg-black bg-opacity-80');
        setHeaderHeight('h-24');
        setLogoSize('w-44 h-auto');
      } else {
        setBgColor('bg-black bg-opacity-80');
        setHeaderHeight('h-24');
        setLogoSize('w-44 h-auto');
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, pathname]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      try {
        const response = await axios.get(`/api/products?search=${term}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (id: string) => {
    router.push(`/product/${id}`);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-8 ${bgColor} ${headerHeight} z-20 transition-all duration-300 ease-in-out`}>
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
        <a href="https://www.memegeorgette.com/" className="relative text-white hover:text-orange-600 font-semibold">Nous Découvrir</a>
        <a href="/contact" className="relative text-white hover:text-orange-600 font-semibold">Contact</a>
      </nav>

      {/* Center Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <a href="/" className="flex items-center transition-all duration-300 ease-in-out">
          <Image
            src="/images/logo3.svg"
            alt="Logo Mémé Georgette"
            width={logoSize === 'w-44 h-auto' ? 180 : 120}
            height={30}
            className={`${logoSize} transition-all duration-300 ease-in-out`}
          />
        </a>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex items-center space-x-6 mr-10">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Rechercher un vin..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-800"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-6 h-6" />
          {/* Suggestions Dropdown */}
          {searchResults.length > 0 && (
            <ul className="absolute mt-2 w-full bg-white rounded-md shadow-lg z-30">
              {searchResults.map(product => (
                <li key={product.id} onClick={() => handleResultClick(product.id)} className="cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-orange-600 hover:text-white">
                  {product.name}
                </li>
              ))}
            </ul>
          )}
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

        {/* Shopping Cart Icon */}
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
        <div className="absolute top-full left-0 right-0 bg-white p-4 rounded-md shadow-lg z-30">
          <a href="/" className="block py-2 text-gray-800">Accueil</a>
          <a href="https://www.memegeorgette.com/" className="block py-2 text-gray-800">Nous Découvrir</a>
          <a href="/contact" className="block py-2 text-gray-800">Contact</a>
          <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="block py-2 text-gray-800">Mon Compte</button>
          {isUserMenuOpen && (
            <div className="mt-2">
              {isLoggedIn ? (
                <>
                  <a href="/dashboard" className="block py-2 text-gray-800">Mon Dashboard</a>
                  <button onClick={() => setIsLoggedIn(false)} className="block py-2 text-gray-800">Se Déconnecter</button>
                </>
              ) : (
                <>
                  <a href="/login" className="block py-2 text-gray-800">Se Connecter</a>
                  <a href="/register" className="block py-2 text-gray-800">S&apos;inscrire</a>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
