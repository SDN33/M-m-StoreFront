'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Search, Wine } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  images: ProductImage[];
}

interface Vendor {
  id: string;
  shop: {
    display_name: string;
    image?: string;
    banner?: string;
    title?: string;
    description?: string;
  };
  name?: string;
  description?: string;
  address?: {
    city?: string;
    postcode?: string;
  };
  social?: Record<string, string>;
  products?: Product[];
}

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/get-vendor');
        if (!response.ok) {
          throw new Error(`Error fetching vendors: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch {
        throw new Error('Failed to fetch vendors');
      }
    };

    const fetchProductsForVendor = async (vendorId: string) => {
      try {
        const response = await fetch(`/api/get-vendor-products?vendorId=${vendorId}`);
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const products = await response.json();
        // Prenons seulement les 3 derniers produits
        return products.slice(0, 3);
      } catch (error) {
        console.error(`Error fetching products for vendor ${vendorId}:`, error);
        return [];
      }
    };

    const fetchAllData = async () => {
      try {
        const vendorData = await fetchVendors();
        const vendorsWithProducts = await Promise.all(
          vendorData.map(async (vendor: Vendor) => {
            const products = await fetchProductsForVendor(vendor.id);
            return { ...vendor, products };
          })
        );

        // Extraire et trier les villes uniques des vignerons
        const cities = [...new Set(vendorsWithProducts
          .map(vendor => vendor.address?.city)
          .filter(city => city && city.length > 0))] as string[];
        setAvailableCities(cities.sort());

        setVendors(vendorsWithProducts);
        setFilteredVendors(vendorsWithProducts);
        setError('');
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Impossible de charger les vignerons. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor => {
      const matchesSearch = vendor.shop?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = !selectedCity || vendor.address?.city === selectedCity;
      return matchesSearch && matchesCity;
    });
    setFilteredVendors(filtered);
  }, [searchTerm, selectedCity, vendors]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-48 mx-8">
      <div className='text-center text-xs mx-auto text-gray-950 mb-4'><a href="/">Accueil</a> / <strong>Nos Vignerons.nes</strong></div>

      <div className="text-center mb-10 bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 pt-7 rounded-t-xl mx-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-8">
          Nos Vignerons Partenaires&nbsp;
          <Wine size={32} className="inline text-white animate-ping duration-1000" />
        </h1>
        <div className="border-b-4 border-white w-full max-w-[50rem] my-2 mx-auto"></div>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <div>
          <p className="text-center text-xl font-black -mt-4 mb-4 text-teal-800">
            &ldquo;Chaque domaine est unique, nos vignerons jouent franc-jeu avec la nature&ldquo;
          </p>
          <p className="text-center text-base font-serif -mt-2">
            Nos vignerons s&apos;engagent pour une agriculture respectueuse de l&apos;environnement,
            garantissant des vins de qualité, riches en saveurs et sans produits chimiques.
            Choisir leurs vins, c&apos;est soutenir une viticulture durable et éthique.
          </p>
          <div className='border-t-2 border-primary w-16 mt-4 flex mx-auto'></div>
          <br /><br />
        </div>

        <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        viewport={{ once: true }}
            >
        <Image
          src="https://res.cloudinary.com/daroyxenr/image/upload/q_auto:good/v1734051910/Design_sans_titre_54_nsgmrl.webp"
          alt="Vineyard"
          width={1920}
          height={1080}
          className='rounded-lg mb-8'
          priority={true}
          fetchPriority='high'
        />
            </motion.div>

        {/* Search and Filter Section */}
        <div className="my-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">Trouvez un Vigneron par localisation</h2>
          <br />
          <p className='text-center'>Recherchez nos vignerons partenaires par nom ou ville, ou filtrez par ville :</p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-950" size={20} />
              <input
                type="text"
                placeholder="Rechercher un domaine..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <label htmlFor="city-select" className="sr-only">Select City</label>
            <select
              id="city-select"
              className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Toutes les villes</option>
              {availableCities.map(city => (
              <option key={city} value={city}>
                {city.split(/[\s-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
              </option>
              ))}
            </select>
          </div>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <p className="text-yellow-700">Aucun vignerons trouvés.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredVendors.map((vendor) => {
              const avatar = vendor.shop?.image || vendor.shop?.banner;
              return (
                <div
                  key={vendor.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex items-center">
                      {avatar && (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                          <img
                            src={avatar.startsWith('//') ? `https:${avatar}` : avatar}
                            alt={vendor.shop?.title || 'Vendor Avatar'}
                            className="w-full h-full object-cover"
                            width={64}
                            height={64}
                          />
                        </div>
                      )}
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {vendor.shop?.title || 'Unknown Vendor'}
                        </h2>
                        {vendor.address?.city && (
                          <span className=" -mt-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {vendor.address.city.split(/[\s-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} ({vendor.address?.postcode?.substring(0, 2) || 'N/A'})
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/vignerons/${vendor.id}`}
                      className="inline-flex items-center text-xs px-2 font-normal py-2 bg-blue-50 text-teal-800 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      Voir plus →
                    </Link>
                  </div>

                  {vendor.shop?.description && (
                    <div className="mt-4 text-gray-700 text-sm max-w-3xl mx-auto text-center">
                      {vendor.shop.description?.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="mb-2 leading-relaxed">
                        {paragraph.replace(/<\/?[^>]+(>|$)/g, "").trim()}
                        </p>
                      )
                      ))}
                    </div>
                  )}

                  {vendor.products && vendor.products.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-teal-800 mb-4 text-center">Vins Recommandés</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {vendor.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            {product.images && product.images[0] && (
                              <div className="w-24 h-24 mb-3 relative overflow-hidden rounded-full border-2 border-white shadow-sm">
                                <Link href={`/produits/${product.id}`} passHref>
                                  <img
                                    src={product.images[0].src}
                                    alt={product.name}
                                    sizes='24'
                                    className="transition-transform duration-300 hover:scale-110"
                                  />
                                </Link>
                              </div>
                            )}
                            <h4 className="font-semibold text-sm text-center text-gray-800 line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-gray-950 font-semibold mt-1">
                              {product.price}€
                            </p>
                            <p className="text-gray-950 mt-1 text-center text-xs">
                                {product.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 85)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <img
          src="/images/bannereco2.png"
          alt="Vineyard"
          width={1920}
          height={1080}
          className="rounded-lg mb-8 mt-8"
        />
      </div>
    </div>
  );
};

export default VendorsPage;
