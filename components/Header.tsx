'use client';

import { Menu as MenuIcon, X, ChevronDown, ChevronRight, ChevronLeft, Rss, BadgePercent, UsersRound, MessageCircleQuestion} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CartPopup from './CartPopup';
import SearchInput from './SearchInput';
import PromotionSection from './PromotionSection';
import AuthButton from './AuthButton';
import CartIcon from './CartIcon';
import Link from 'next/link';
import NosVinsPopup from './NosVinsPopup';

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
    { name: 'PROMOS', href: '/promos', className: '!text-primary font-gray-950', icon: <BadgePercent className="inline-block ml-1 -mt-1 w-4 h-4" /> },
    { name: 'Nos Vins', href: '#', onClick: toggleNosVinsPopup, className: 'bg-black !text-white hover:bg-primary ', icon: <ChevronDown className={` inline-block ml-1 w-4 h-4 transition-transform ${isNosVinsOpen ? 'rotate-180' : ''}`} /> },
    { name: 'Découvrir Mémé Georgette', href: 'https://memegeorgette.com', target: "_blank", rel: "noopener noreferrer" },
    { name: 'Nos Vignerons.nes', href: '/vignerons' },
    { name: 'Vins Sans Sulfites', href: '/vins-sans-sulfites' },
    { name: 'Spiritueux', href: '/spiritueux' },
    { name: 'Contactez-nous', href: '/contact' },
    { name: 'Blog', href: '/blog', icon: <Rss className="inline-block ml-1 -mt-1 w-4 h-4" /> },
  ];

  const vinsSubCategories = [
    {
      name: 'Les vins Rouges',
      href: '/vins/rouge',
      bgClass: 'bg-gradient-to-r from-bordeaux-light to-bordeaux-light',
    },
    {
      name: 'Les vins Blancs',
      href: '/vins/blanc',
      bgClass: 'bg-wine-white-deep',
    },
    {
      name: 'Les vins Rosés',
      href: '/vins/rose',
      bgClass: 'bg-gradient-to-r from-rose-pale to-rose-700',
    },
    {
      name: 'Les vins Pétillants',
      href: '/vins/petillant',
      bgClass: 'bg-gradient-to-r from-teal-800 to-teal-900',
    },
    {
      name: 'Les vins Liquoreux',
      href: '/vins/liquoreux',
      bgClass: 'bg-gradient-to-r from-liquoreux-light to-liquoreux-deep',
    },
    {
      name: 'Les Autres',
      href: '/vins/autres',
      bgClass: 'bg-gradient-to-r from-gray-700 to-gray-950',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full  shadow-sm bg-primary">
      {/* PromotionSection avec hauteur fixe */}
      <div className="h-[30px] hidden lg:flex">
        <PromotionSection />
      </div>

      {/* Top Header - Hauteur fixe */}
      <div className="bg-primary pt-0 md:pt-4 lg:pt-4 pb-1">
        <div className="container mx-auto px-4">
          {/* Desktop and Tablet View - Hauteur fixe */}
          <div className="hidden lg:flex items-center justify-between h-14 relative">
            {/* Container des logos avec dimensions fixes */}
            <div className="relative w-[280px] h-[100px] flex items-center">
              <div className="absolute -left-0 top-1 h-full w-[71px] flex items-center justify-center">
                <Link href="/">
                  <img
                    src="/images/meme-pas-contente.png"
                    alt="Logo"
                    width={200}
                    height={200}
                    className="transform scale-x-[-1] object-contain h-auto w-auto lg:flex hidden"
                  />
                </Link>
              </div>

              <div className=" left-16 pr-4 h-full w-[230px] flex items-center justify-center relative">
                <Link href="/">
                  <Image
                  src="/images/memelogo.png"
                  alt="Logo"
                  fill
                  sizes='230px'
                  className="object-contain"
                  />
                </Link>
              </div>
            </div>

            {/* Search Bar - Largeur fixe */}
            <div className="flex-grow max-w-xl mx-4 ml-30">
              <SearchInput />
            </div>

            {/* Right Actions - Largeur fixe */}

            <div className="hidden md:hidden lg:flex items-center space-x-7 text-sm px-4 justify-end my-auto -ml-10">
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative">
                  <div className='whitespace-nowrap text-center flex flex-col items-center'>
                    <button
                      onClick={toggleLanguageMenu}
                      className="flex items-center space-x-1 text-white font-semibold group hover:text-gray-950"
                    >
                      <span>Livraison</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                      <div className="relative w-6 h-6">
                      <Image
                        src={selectedCountry.imgSrc}
                        alt={selectedCountry.name}
                        fill
                        sizes='30px'
                        className="object-contain"
                      />
                      </div>
                    </button>
                  </div>

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
                              sizes='30px'
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
              <a href="/faq" className="text-white hover:text-gray-950 font-semibold whitespace-nowrap text-center flex flex-col items-center">
                <MessageCircleQuestion className="mb-1 w-5 h-auto" />
                FAQ
              </a>

              <a href="/portailpro" className="text-white hover:text-gray-950 font-semibold whitespace-nowrap text-center flex flex-col items-center">
                <UsersRound className="mb-1 w-5 h-auto" />
                Portail Pro
              </a>
              <AuthButton />
              <div className='text-white space-y-1 hover:text-gray-950 font-semibold whitespace-nowrap text-center flex flex-col items-center'>
                <CartIcon onClick={toggleCartPopup} />
              </div>

            </div>
          </div>

          {/* Mobile View - Hauteur fixe */}
          <div className="flex lg:hidden items-center justify-between h-20 mt-0 md:-mt-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-gray-200"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

            <div className="relative h-[200px] w-[200px] flex items-center justify-center -pl-10">
              <Link href="/">
                <Image
                  src="/images/memelogo.png"
                  alt="Logo"
                  fill
                  sizes='200px'
                  className="object-contain"
                  priority={true}
                  fetchPriority='high'
                />
              </Link>
            </div>

            <div className="flex items-center space-x-2 mt-1 !text-white">
              <CartIcon onClick={toggleCartPopup} />
            </div>
          </div>
          <div className=' -mt-2 sm:flex md:flex lg:hidden xl:hidden mb-2'>
          <SearchInput />
          </div>




          {/* Mobile Menu - Position absolue pour ne pas affecter la hauteur du header */}
          {isMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl z-50">
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
                        sizes='30px'
                        className="object-contain"
                      />
                    </div>
                    <span>{selectedCountry.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

                <nav className="border-t border-gray-100">
                <div className="px-4 py-3">
                  <AuthButton />
                </div>

                {categories.map((category) => (
                  <a
                  key={category.name}
                  href={category.href}
                  onClick={category.onClick}
                  className={`block px-4 py-3 text-gray-950 hover:bg-gray-50 transition-colors font-bold ${
                    category.className || ''
                  }`}
                  >
                  {category.name}
                  {category.icon}
                  </a>
                ))}
                </nav>

              <div className="border-t border-gray-100 p-4 space-y-2 font-bold">
                <a href="/portailpro" className="block py-2 text-primary hover:text-primary">
                  Portail Pro
                </a>
                <a href="/faq" className="block py-2 text-primary hover:text-primary font-bold">
                  Aide
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NAV Menu */}
      <nav className="hidden sm:min-w-sm md:hidden lg:flex xl:flex mt-1 bg-white shadow-xl relative h-14 mx-auto">
          <div className="container mx-auto h-full flex items-center justify-between overflow-x-hidden">
            <ChevronLeft
              className="w-6 h-6 text-gray-950 cursor-pointer hover:text-primary transition-colors flex-shrink-0"
              onClick={() => {
                const scrollContainer = document.querySelector('.scrollable-menu');
                if (scrollContainer) {
                  scrollContainer.scrollBy({ left: -150, behavior: 'smooth' });
                }
              }}
            />
            <ul className="scrollable-menu flex items-center space-x-4 lg:space-x-8 overflow-x-auto no-scrollbar h-full mx-4 pl-8 pr-8 flex-grow">
              {categories.map((category) => (
                <li
                  key={category.name}
                  className="whitespace-nowrap font-bold hover-animate h-full flex items-center text-[13px] lg:text-[15px]"
                >
                  <a
                    href={category.href}
                    onClick={category.onClick}
                    className={`px-4 text-gray-950 hover:text-primary transition-colors flex items-center h-full ${
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
              className="w-6 h-6 text-gray-950 cursor-pointer hover:text-primary transition-colors flex-shrink-0"
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
        <NosVinsPopup isOpen={isNosVinsOpen} onClose={toggleNosVinsPopup} vinsSubCategories={vinsSubCategories} />
      )}

        {/* Cart Popup */}
        <CartPopup isOpen={isCartOpen} onClose={toggleCartPopup} />
      </header>
    );
  };

export default Header;
