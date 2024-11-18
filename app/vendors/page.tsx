'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, Search } from 'lucide-react';

const VendorsPage = () => {
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
    products?: {
      id: string;
      name: string;
      description: string;
      price: number;
    }[];
  }

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const getSocialIcon = (platform: string) => {
    const iconProps = {
      size: 20,
      className: "text-gray-600"
    };

    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  }

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

    const fetchProductsForVendor = async (displayName: string) => {
      try {
        const response = await fetch(`/api/products?store_name=${encodeURIComponent(displayName)}`);
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const products = await response.json();
        return products.filter((product: { store_name: string }) =>
          product.store_name === displayName
        );
      } catch (error) {
        console.error(`Error fetching products for ${displayName}:`, error);
        return [];
      }
    };

    const fetchAllData = async () => {
      try {
        const vendorData = await fetchVendors();
        const vendorsWithProducts = await Promise.all(
          vendorData.map(async (vendor: { shop: { display_name: string } }) => {
            const products = await fetchProductsForVendor(vendor.shop.display_name);
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
        setError('Unable to load vendors and products. Please try again later.');
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
    <div className="min-h-screen bg-gray-50 mt-40">
      <div className="max-w-5xl mx-auto p-6">
        <Image src="/images/vignerons.png" alt="Vineyard" width={1920} height={1080} className="rounded-lg mb-8" />

        <div>
          <p className="text-center text-xl font-extrabold -mt-4 mb-4 slide-in-right text-primary">
            &ldquo;Chaque domaine est unique, nos vignerons jouent franc-jeu avec la nature&ldquo;
          </p>
          <p className="text-center text-sm font-extrabold -mt-2 slide-in-right">
            Nos vignerons s&apos;engagent pour une agriculture respectueuse de l&apos;environnement,
            garantissant des vins de qualité, riches en saveurs et sans produits chimiques.
            Choisir leurs vins, c&apos;est soutenir une viticulture durable et éthique.
          </p>
          <div className='border-t-2 border-primary w-16 mt-4 flex mx-auto'></div>
        </div>

        {/* Search and Filter Section */}
        <div className="my-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un domaine..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Toutes les villes</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <p className="text-yellow-700">Aucun vigneron trouvé pour votre recherche.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex items-center">
                    {vendor.shop?.image && (
                      <Image
                        src={vendor.shop.image.startsWith('//') ? `https:${vendor.shop.image}` : vendor.shop.image}
                        alt={vendor.shop?.title || 'Vendor Avatar'}
                        className="w-16 h-16 rounded-full object-cover"
                        width={64}
                        height={64}
                      />
                    )}
                    <div className="ml-4">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {vendor.shop?.title || 'Unknown Vendor'}
                      </h2>
                      {vendor.address?.city && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center">
                          <MapPin className="w-4 h-4 mr-1"/>{vendor.address.city} ({vendor.address?.postcode?.substring(0, 2) || 'N/A'})
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/vendors/${vendor.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-teal-800 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    Voir plus →
                  </Link>
                </div>

                {vendor.shop?.description && (
                  <p className="text-center mt-4">
                    {vendor.shop.description}
                  </p>
                )}

                {vendor.products && vendor.products.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-700">Nos vins disponibles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {vendor.products.map((product) => (
                        <div key={product.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                          <h4 className="font-semibold text-gray-800">{product.name}</h4>
                          <p className="text-gray-600">{product.description.substring(0, 80)}...</p>
                          <p className="font-semibold text-gray-800">{product.price} €</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {vendor.social && Object.keys(vendor.social).length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex gap-4">
                      {Object.entries(vendor.social).map(([platform, url]) => (
                        url ? (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-sm bg-gray-100 text-primary rounded-full hover:bg-gray-200 transition-colors duration-200"
                          >
                            {getSocialIcon(platform)}
                          </a>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorsPage;
