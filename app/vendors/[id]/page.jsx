'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { MapPin, Globe, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import SocialShare from '@/components/Socialshare';

const normalizeUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  return url.startsWith('http') ? url : `https://${url}`;
};

const SocialIcon = ({ platform }) => {
  const icons = {
    facebook: <Facebook className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    website: <Globe className="w-5 h-5" />
  };
  return icons[platform.toLowerCase()] || <Globe className="w-5 h-5" />;
};

const VendorLocationMap = ({ vendor }) => {
  const hasCity = vendor.address?.city && vendor.address?.address_1;

  if (!hasCity) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>Location information not available</span>
        </div>
      </div>
    );
  }

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(hasCity)}&z=12&output=embed`;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-teal-800">Localisation</h2>
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="w-5 h-5 mr-2" />
        <span>
          {vendor.address.street || ''} {vendor.address.city || ''} {vendor.address.postcode || ''}
        </span>
      </div>
      <div className="w-full h-64 rounded-lg overflow-hidden">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{border: 0}}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default function VendorDetailsPage() {
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      const fetchVendorDetails = async () => {
        try {
          const vendorResponse = await fetch('/api/get-vendor', {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: { 'Content-Type': 'application/json' }
          });
          const vendorData = await vendorResponse.json();
          setVendor(vendorData);

          const productResponse = await fetch(`/api/get-vendor-products?vendorId=${id}`);
          if (!productResponse.ok) {
            throw new Error('Failed to fetch vendor products');
          }
          const productsData = await productResponse.json();
          setProducts(productsData);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch vendor details or products');
        } finally {
          setLoading(false);
        }
      };
      fetchVendorDetails();
    } else {
      setLoading(false);
      setError('No ID provided in the URL');
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="w-full h-64 bg-gray-200 rounded-b-lg" />
        <div className="flex items-end -mt-16 px-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white" />
        </div>
        <div className="mt-4 space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-red-500 font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500">No vendor details available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-36 mb-24">

      <div className="relative">
        <Image
          src={vendor.shop?.banner ? normalizeUrl(vendor.shop.banner) : '/images/slider3.png'}
          alt={`${vendor.shop?.title || 'Vendor'} banner`}
          width={1200}
          height={400}
          className="object-cover"
        />
        <div className="absolute -bottom-16 left-6">
          <Image
            src={vendor.shop?.image ? normalizeUrl(vendor.shop.image) : '/images/meme-pas-contente.png'}
            alt={`${vendor.display_name || 'Vendor'} profile`}
            width={128}
            height={128}
            className="rounded-full border-4 border-white object-cover bg-white shadow-lg"
          />
        </div>
      </div>

      <div className="mt-20 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{vendor.shop?.title || '@MéméGeorgette'}</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-teal-800">À propos</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{vendor.shop.description ? vendor.shop.description.replace(/<\/?[^>]+(>|$)/g, "") : ''}</p>
        </div>

        {vendor.address && (
          <VendorLocationMap vendor={vendor} />
        )}

        {vendor.social && Object.entries(vendor.social)
          .filter(([, url]) => url && url.trim() !== '')
          .length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-teal-800">Réseaux sociaux</h2>
              <div className="flex flex-wrap gap-4">
                {Object.entries(vendor.social)
                  .filter(([, url]) => url && url.trim() !== '')
                  .map(([platform, url]) => (
                    <a
                      key={platform}
                      href={normalizeUrl(url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <SocialIcon platform={platform} />
                      <span className="capitalize">{platform}</span>
                    </a>
                  ))
                }
              </div>
            </div>
          )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-teal-800">Vins en vente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg">
                  <Link href={`/product/${product.id}`} passHref>
                    <Image
                      src={product.images[0]?.src || '/images/vinmeme.png'}
                      alt={product.name}
                      width={160}
                      height={160}
                      className="object-cover rounded"
                    />
                  </Link>
                  <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.price} €</p>
                </div>
              ))
            ) : (
              <p>Aucun produit trouvé pour ce vendeur.</p>
            )}
          </div>
          <br />
          <SocialShare />
        </div>
      </div>
    </div>
  );
}
