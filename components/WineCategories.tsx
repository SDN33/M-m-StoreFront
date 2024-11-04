import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Grape, ChevronDown, Filter, Search } from 'lucide-react';

interface Vendor {
  id: number;
  store_name: string;
  products: {
    id: number;
    name: string;
    store_name: string;
    vendor_id: number;
    vendor_image: string;
    region__pays: string;
    images: { src: string }[];
    price: number;
    millesime: string;
    degre: number;
    certification?: string;
    cepages: string[];
  }[];
  vendor_image: string;
  region__pays: string;
  certifications: {
    bio: number;
    biodynamie: number;
    conversion: number;
  };
  images?: string;
}



const VendorSlider = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const vendorMap: { [key: string]: Vendor } = {};
        products.forEach((product: Vendor['products'][0]) => {
          const storeName = product.store_name || '@MéméGeorgette';
          if (!vendorMap[storeName]) {
            vendorMap[storeName] = {
              id: product.vendor_id,
              store_name: storeName,
              products: [],
              vendor_image: product.vendor_image,
              region__pays: product.region__pays,
              images: product.images[0]?.src,
              certifications: {
                bio: 0,
                biodynamie: 0,
                conversion: 0,
              },
            };
          }
          vendorMap[storeName].products.push(product);
          if (product.certification) {
            const certLower = product.certification.toLowerCase();
            if (certLower.includes('biodynamie')) {
              vendorMap[storeName].certifications.biodynamie++;
            } else if (certLower.includes('bio')) {
              vendorMap[storeName].certifications.bio++;
            } else if (certLower.includes('conversion')) {
              vendorMap[storeName].certifications.conversion++;
            }
          }
        });

        setVendors(Object.values(vendorMap));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatRegion = (region: string) => {
    return region
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatStoreName = (name: string) => {
    if (name.startsWith('@')) {
      return name;
    }
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getCardColor = (certifications: { bio: number; biodynamie: number; conversion: number }) => {
    if (certifications.biodynamie > 0) return 'from-primary to-red-900';
    if (certifications.bio > 0) return 'from-teal-800 to-teal-950';
    if (certifications.conversion > 0) return 'from-amber-700 to-amber-900';
    return 'from-gray-800 to-gray-950';
  };

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % vendors.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + vendors.length) % vendors.length);

  const regions = ['all', ...new Set(vendors.map(v => v.region__pays))].sort();

  const filteredVendors = vendors
    .filter(vendor =>
      (selectedRegion === 'all' || vendor.region__pays === selectedRegion) &&
      (searchTerm === '' ||
        formatStoreName(vendor.store_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatRegion(vendor.region__pays).toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => formatStoreName(a.store_name).localeCompare(formatStoreName(b.store_name)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 overflow-hidden">
      {/* Header Section */}
      <h2 className="flex items-center justify-center text-xl font-bold mb-6 text-center">
        <div className="border-t border-primary w-1/4" />
        <span className="mx-4 flex items-center gap-2 text-primary text-2xl">Les Domaines & Vignerons</span>
        <div className="border-t border-primary w-1/4" />
      </h2>

      <br />
      {/* Slider Section */}
      <div className="relative perspective-1000">
        <div className="relative flex h-[380px] overflow-x-scroll scrollbar-hidden justify-center">
          {vendors.map((vendor, index) => {
            const isActive = index === activeIndex;
            const offset = index - activeIndex;
            const translateX = offset * 10;
            const translateZ = isActive ? 0 : -100 - Math.abs(offset) * 50;
            const rotateY = offset * 15;
            const opacity = Math.max(1 - Math.abs(offset) * 0.3, 0);
            const scale = isActive ? 1 : 0.85;
            const zIndex = vendors.length - Math.abs(offset);

            return (
              <div
                key={vendor.store_name}
                className="relative w-80 h-[320px] flex cursor-pointer transform-gpu"
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginLeft: index === 0 ? '0' : '-2rem',
                }}
                onClick={() => setActiveIndex(index)}
              >
                <div
                  className={`flex w-full h-full rounded-2xl shadow-xl overflow-hidden
                           bg-gradient-to-br ${getCardColor(vendor.certifications)}
                           hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mx-auto
                           border border-white/10`}
                >
                  <div className="p-6 h-full w-full flex flex-row justify-between">
                    {/* Left side - Photo, Name, Region, Wine Count */}
                    <div className="flex flex-col space-y-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-2 border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <img
                          src={vendor.vendor_image || '/images/meme-pas-contente.png'}
                          alt={formatStoreName(vendor.store_name)}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col space-y-3">
                        <h3 className="text-sm font-bold text-white">
                          {formatStoreName(vendor.store_name)}
                        </h3>

                        {vendor.region__pays && (
                          <div className="flex items-center text-white/90 text-sm gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{formatRegion(vendor.region__pays)}</span>
                          </div>
                        )}

                        <div className="flex items-center text-white text-sm gap-1.5">
                          <Grape className="w-4 h-4" />
                          {vendor.certifications.biodynamie > 0 ? 'Biodynamie' :
                           vendor.certifications.bio > 0 ? 'Bio' :
                           vendor.certifications.conversion > 0 ? 'En conversion' :
                           'Traditionnel'}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Product Photos */}
                    <div className="flex flex-col items-center space-y-3">
                      {vendor.products.slice(0, 3).map((product, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 bg-gradient-to-r from-white/5 to-white/10 rounded-full overflow-hidden border-2 border-white/20 shadow-md transform hover:scale-110 transition-all duration-300 hover:bg-accent"
                        >
                          <img
                            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0].src : '/images/vinmeme.png'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View More Button */}
                  <Link href={`/vendor/${vendor.id}`} passHref>
                    <button className="absolute bottom-4 right-4 bg-white text-primary font-bold py-2 px-4 rounded-md shadow-lg transition-transform duration-300 transform hover:scale-105">
                      Voir plus
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
          onClick={nextSlide}
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      <p className="text-center text-teal-500 text-xl font-extrabold -mt-4 mb-4">
        &ldquo;Chaque domaine est unique, nos vignerons jouent franc-jeu avec la nature&ldquo;
      </p>
      {/* Bio Winemakers Description */}
      <p className="text-center text-sm font-extrabold -mt-4 mb-16">
        Nos vignerons bio s&apos;engagent pour une agriculture respectueuse de l&apos;environnement,
        garantissant des vins de qualité, riches en saveurs et sans produits chimiques.
        Choisir leurs vins, c&apos;est soutenir une viticulture durable et éthique.
      </p>

      {/* Enhanced Winemakers List */}
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6 -mt-8">
        <div className="flex flex-col space-y-4">
          {/* Header and Expand Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">
            A la rencontre de nos vignerons et domaines partenaires
            </h3>
            <button
              onClick={() => setIsListExpanded(!isListExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {isListExpanded ? 'Réduire' : 'Voir tout'}
              <ChevronDown className={`w-4 h-4 transform transition-transform ${isListExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un vigneron ou une région..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'Toutes les régions' : formatRegion(region)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <video
            src="/videos/minibanner.mp4"
            width={1920}
            height={400}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`hidden md:block w-full h-[78px] object-fit rounded-xl shadow-xl transition-all duration-300 ${isListExpanded ? 'block' : 'hidden'}`}
          >
            Your browser does not support the video tag.
          </video>

          <div className={`grid gap-4 transition-all duration-300 ${isListExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {filteredVendors.slice(0, isListExpanded ? undefined : 6).map(vendor => (
              <Link href={`/vendor/${vendor.id}`} key={vendor.id} className="group">
                <div className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-all duration-300 hover:border-primary bg-gradient-to-br from-gray-50 to-white">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-colors">
                    <img
                      src={vendor.vendor_image || '/images/meme-pas-contente.png'}
                      alt={vendor.store_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {formatStoreName(vendor.store_name)}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{vendor.region__pays.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Grape className="w-4 h-4" />
                      <span>
                        {vendor.certifications.biodynamie > 0 ? 'Biodynamie' :
                         vendor.certifications.bio > 0 ? 'Bio' :
                         vendor.certifications.conversion > 0 ? 'En conversion' : 'Traditionnel'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!isListExpanded && filteredVendors.length > 6 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setIsListExpanded(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Voir plus de vignerons
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorSlider;
