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
  const hasCity = vendor.shop?.title && vendor.address?.city && vendor.address?.address_1 && vendor.address.postcode;
  const zoomLevel = 5; // Ajustez le zoom ici (entre 1 et 20, 1 étant le plus éloigné)


  if (!hasCity) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          <span>Localisation non disponible</span>
        </div>
      </div>
    );
  }

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(vendor.address.address_1 || '')} ${encodeURIComponent(vendor.address.city || '')} ${encodeURIComponent(vendor.address.postcode || '')}&z=${zoomLevel}&output=embed`;


  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center text-gray-600 mb-4 text-center mx-auto justify-center">
        <MapPin className="w-5 h-5 mr-2" />
        <span>
          {vendor.address.city || ''} {vendor.address.postcode || ''}
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-75"></div>
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
    <div className="max-w-4xl mx-auto mt-40 sm:mt-40 md:mt-44 lg:mt-48 mb-24">
      <div className='text-center text-xs m</div>x-auto text-gray-950 mb-4'><a href="/">Accueil</a> / <a href="/vignerons">Nos Vignerons.nes</a> / <strong>{vendor.shop?.title}</strong></div>

      <div className="relative">
        <Image
          src={vendor.shop?.banner ? normalizeUrl(vendor.shop.banner) : '/images/slider3.png'}
          alt={`${vendor.shop?.title || 'Vendor'} banner`}
          width={2000}
          height={2000}

        />
        <div className="absolute -bottom-16 left-6">
          <br />
          <Image
            src={vendor.shop?.image ? normalizeUrl(vendor.shop.image) : '/images/meme-pas-contente.png'}
            alt={`${vendor.display_name || 'Vendor'} profile`}
            width={180}
            height={180}
            className="rounded-full border-4 border-white bg-white shadow-lg"
          />
        </div>
      </div>

      <div className="mt-4 px-6">
        <div className=" ">
          <div>
            <h1 className="text-2xl font-bold text-center"><span className='sm:flex md:hidden'><br /><br /></span>{vendor.shop?.title || '@MéméGeorgette'}</h1>
          </div>
        </div>
        {vendor.address && (
          <VendorLocationMap vendor={vendor} />
        )}

        {vendor.social && Object.entries(vendor.social)
          .filter(([, url]) => url && url.trim() !== '')
          .length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-teal-800 text-center">Réseaux sociaux</h2>
              <div className="flex flex-wrap gap-4 justify-center">
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-teal-800 text-center">Histoire du domaine</h2>
          {vendor.shop.description ? (
            <p className="text-gray-600 whitespace-pre-wrap text-center">
              {vendor.shop.description
                .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
                .split('\n') // Split into paragraphs
                .map((paragraph, index) => (
                  paragraph.trim() && (
                    <span key={index} className="block mb-2">
                      {paragraph.trim()}
                    </span>
                  )
                ))
              }
            </p>
          ) : (
            <p className="text-gray-500 text-center italic">Aucune description disponible</p>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-teal-800 text-center">Vins en vente</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <Link href={`/produits/${product.id}`} passHref>
                    <Image
                      src={product.images[0]?.src || '/images/vinmeme.png'}
                      alt={product.name}
                      width={160}
                      height={160}
                      className="rounded flex mx-auto justify-center"
                    />
                  </Link>
                  <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-950 mt-1 text-center text-xs">
                    {product.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 85)}...
                  </p>
                  <p className="text-gray-600 mt-2">{product.price} €</p>
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
          <br />
          <div className='flex mx-auto justify-center'>
            <SocialShare url={window.location.href} title={`Découvrez ${vendor.name}, sur VinsMemeGeorgette.com`} />
          </div>
        </div>
      </div>
    </div>
  );
}
