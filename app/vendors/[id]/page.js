'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import axios from 'axios';
import { MapPin } from 'lucide-react';



export default function VendorDetailsPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams(); // Use useParams to get the path parameter
  const id = params?.id; // Extract the 'id' from the URL path
  console.log('id :>> ', id);
  useEffect(() => {
    if (id) {
      const fetchVendorDetails = async () => {
        try {
          const response = await axios.post(`/api/get-vendor`, { id });
          console.log('response', response.data);
          setVendor(response.data);
        } catch (err) {
          console.error('Error fetching vendor details:', err.message);
          setError('Failed to fetch vendor details');
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
    return <div className='sx-container'>Loading...</div>;
  }
  if (error) {
    return <div className='sx-container'>Error: {error}</div>;
  }
  if (!vendor) {
    return <div className='sx-container'>No vendor details available</div>;
  }
  return (
    <div className='sx-container'>
      <img src={vendor.shop.banner} alt={`${vendor.shop.title} banner`} style={{ width: '100%', maxHeight: '300px' }} />
      <img src={vendor.shop.image} alt={`${vendor.display_name} profile`} style={{ borderRadius: '50%', width: '150px', height: '150px' }} />
      <h1 className='text-xl font-bold'>{vendor.shop.title}</h1>
      <h3>Réseaux sociaux</h3>
      <ul>
        {Object.entries(vendor.social).map(([platform, url]) => (
          <li key={platform}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {platform}
            </a>
          </li>
        ))}
      </ul>

      <p>{vendor.address?.city && (
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center">
            <MapPin className="w-4 h-4 mr-1"/>{vendor.address.city} ({vendor.address?.postcode?.substring(0, 2) || 'N/A'})
          </span>
        )}
      </p>
      <p className='py-10'>{vendor.shop.description}</p>
    </div>
  );
}
