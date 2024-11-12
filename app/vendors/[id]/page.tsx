"use client"; // Ensure this is at the top
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import axios from 'axios';

type VendorDetails = {
  id: number;
  name: string;
  description: string;
  social: Record<string, string>;
  picture: string;
  avatar_id: string;
  banner: string;
  shop: {
    title: string;
    image: string;
  };
};

export default function VendorDetailsPage() {
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
        } catch (err: any) {
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
      <h1>{vendor.shop.title}</h1>
      <img src={vendor.shop.image} alt={`${vendor.shop.title} banner`} style={{ width: '100%', maxHeight: '300px' }} />
      <img src={vendor.avatar_id} alt={`${vendor.display_name} profile`} style={{ borderRadius: '50%', width: '150px', height: '150px' }} />
      <p>{vendor.description}</p>
      <h3>Social Media Links</h3>
      <ul>
        {Object.entries(vendor.social).map(([platform, url]) => (
          <li key={platform}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {platform}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
