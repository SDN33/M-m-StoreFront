import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin, Grape } from 'lucide-react';

const VendorSlider = () => {
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

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<Vendor['products'][0] | null>(null);

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

  const getCardColor = (certifications: { bio: number; biodynamie: number; conversion: number }) => {
    if (certifications.biodynamie > 0) return 'from-primary to-red-900';
    if (certifications.bio > 0) return 'from-teal-800 to-teal-950';
    if (certifications.conversion > 0) return 'from-amber-700 to-amber-900';
    return 'from-gray-800 to-gray-950';
  };

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % vendors.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + vendors.length) % vendors.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 overflow-hidden">
      <h2 className="flex items-center justify-center text-xl font-bold mb-6 text-center">
        <div className="border-t border-primary w-1/4" />
        <span className="mx-4 flex items-center gap-2">Les Domaines & Vignerons</span>
        <div className="border-t border-primary w-1/4" />
      </h2>

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
                <div className={`flex w-full h-full rounded-2xl shadow-xl overflow-hidden
                                bg-gradient-to-br ${getCardColor(vendor.certifications)}
                                hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mx-auto
                                border border-white/10}`}>
                  <div className="p-6 h-full w-full flex flex-row justify-between">
                    {/* Left side - Photo, Name, Region, Wine Count */}
                    <div className="flex flex-col space-y-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-2 border-white/20 shadow-lg transform hover:scale-105 transition-all duration-300">
                        <img
                          src={vendor.vendor_image || '/images/meme-pas-contente.png'}
                          alt={vendor.store_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col space-y-3">
                        <h3 className="text-sm font-bold text-white">{vendor.store_name}</h3>

                        {vendor.region__pays && (
                          <div className="flex items-center text-white/90 text-sm gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{vendor.region__pays.toUpperCase()}</span>
                          </div>
                        )}

                        <div className="flex items-center text-white text-sm gap-1.5">
                          <Grape className="w-4 h-4" />
                          {vendor.certifications.bio > vendor.certifications.biodynamie && vendor.certifications.bio > vendor.certifications.conversion
                            ? 'Bio'
                            : vendor.certifications.biodynamie > vendor.certifications.conversion
                            ? 'Biodynamie'
                            : 'Conversion'}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Photos */}
                    <div className="flex flex-col items-center space-y-3">
                      {vendor.products.slice(0, 3).map((product, idx) => (
                        <div key={idx} className="w-16 h-16 bg-gradient-to-r from-white/5 to-white/10 rounded-full overflow-hidden border-2 border-white/20 shadow-md transform hover:scale-110 transition-all duration-300 hover:bg-accent"
                             onMouseEnter={() => setHoveredProduct(product)}
                             onMouseLeave={() => setHoveredProduct(null)}
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
                  {/* Bouton "Voir plus" placé en bas à droite */}
                  <Link href={`/vendor/${vendor.id}`} passHref>
                    <button className="absolute bottom-4 right-4 px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium
                                     shadow-md hover:bg-white/20 transition-all duration-300 border border-white/20">
                      Découvrir
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <button
          className="absolute top-1/2 left-3 transform -translate-y-1/2 hidden rounded-full p-2 shadow-lg hover:bg-gray-300 transition"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="absolute top-1/2 right-3 transform -translate-y-1/2 hidden text-white bg-primary rounded-full p-2 shadow-lg hover:bg-gray-300 transition"
          onClick={nextSlide}
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Affichage de la description pour le produit survolé */}
        {hoveredProduct && (
          <div className="absolute text-white bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 opacity-90 p-4 rounded shadow-lg z-20">
            <h4 className="font-bold text-lg">{hoveredProduct.name}</h4>
            <p className="text-sm">Prix : {hoveredProduct.price}€</p>
            <p className="text-sm">Millésime : {hoveredProduct.millesime}</p>
            <p className="text-sm">Cépages : {hoveredProduct.cepages.join(', ')}</p>
            <p className="text-sm">Degré : {hoveredProduct.degre}°</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorSlider;
