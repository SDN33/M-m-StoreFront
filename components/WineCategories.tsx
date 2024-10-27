import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const VendorSlider = () => {
  interface Vendor {
    id: number;
    store_name: string;
    products: any[];
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const products = await response.json();

        const vendorMap: { [key: string]: any } = {};
        products.forEach((product: any) => {
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
    if (certifications.biodynamie > 0) return 'from-purple-700 to-purple-900';
    if (certifications.bio > 0) return 'from-gray-800 to-teal-700';
    if (certifications.conversion > 0) return 'from-amber-600 to-amber-800';
    return 'from-gray-700 to-gray-900';
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
    <div className="relative w-full max-w-7xl mx-auto px-4 overflow-hidden">
      <h2 className="flex items-center justify-center text-xl font-bold mb-6 text-center">
        <div className="border-t border-primary w-1/4" />
        <span className="mx-4">Les Domaines & Vignerons</span>
        <div className="border-t border-primary w-1/4" />
      </h2>

      <div className="relative perspective-1000">
        <div className="relative flex h-[380px] overflow-x-scroll scrollbar-hidden">
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
                className="relative w-80 h-[320px] flex cursor-pointer transform-gpu" // Increased height for better layout
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  marginLeft: index === 0 ? '0' : '-2rem', // Negative margin to bring cards closer
                }}
                onClick={() => setActiveIndex(index)}
              >
                <div className={`flex w-full h-full rounded-2xl shadow-xl overflow-hidden
                                bg-gradient-to-br ${getCardColor(vendor.certifications)}
                                hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}>
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex-grow flex flex-row items-center">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-spacing-3 border-primary shadow-lg transform hover:scale-105 transition-all duration-300">
                          <img
                            src={vendor.vendor_image || '/images/meme-pas-contente.png'}
                            alt={vendor.store_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col space-y-2">
                        <h3 className="text-base font-bold text-white">
                          {vendor.store_name}
                        </h3>

                        {vendor.region__pays && (
                          <div className="flex items-center text-white/90 text-sm">
                            <MapPin className="w-4 h-4 " />
                            <span>{vendor.region__pays.charAt(0).toUpperCase() + vendor.region__pays.slice(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mb-2">
                      {vendor.products.slice(0, 3).map((product, idx) => (
                        <div key={idx} className="relative w-16 h-16 bg-gradient-to-r from-accent to-white rounded-full overflow-hidden border-2 border-white shadow-md transform transition-all duration-300" style={{ zIndex: 3 - idx }}>
                          <img
                            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0].src : '/images/vinmeme.png'}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="text-white text-sm">
                      Vigneron de {vendor.region__pays} proposant {vendor.products.length} vins biologiques
                    </div>

                    <Link href={`/vendor/${vendor.id}`} passHref>
                      <button className="mt-4 px-3 py-1 bg-white text-gray-800 rounded-full text-sm font-medium shadow-md hover:bg-gray-100 transition-colors">
                        Découvrir
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute -bottom-12 left-0 right-0 flex justify-center space-x-3">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorSlider;
