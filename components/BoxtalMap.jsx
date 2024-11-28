import Script from 'next/script';
import { useEffect, useState } from 'react';

const BoxtalMap = ({ onSelectPoint }) => {
  const [boxtalLoaded, setBoxtalLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Fetch access token from your API
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('/api/get-boxtal-token'); // Replace with your endpoint
        const data = await response.json();
        setAccessToken(data.token); // Assuming response has token key
      } catch (error) {
        console.error('Failed to fetch access token:', error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (boxtalLoaded && accessToken) {

      // Initialize BoxtalMaps with access token and baseUrl
      const boxtalMaps = new BoxtalMaps({
        domToLoadMap: '#parcel-point-map',
        accessToken,
        baseUrl: 'https://maps.boxtal.com/app/v3', // Correct base URL
        config: {
          locale: 'fr',
          parcelPointNetworks: [
            {
              code: ['CHRP_NETWORK', 'MONR_NETWORK', 'SOGP_NETWORK'],
              markerTemplate: { color: '#94a1e8' },
            },
          ],
          options: {
            primaryColor: '#00FA9A',
            autoSelectNearestParcelPoint: true,
          },
        },
        onMapLoaded: () => {
          console.log('Boxtal map loaded successfully');
        },
      });

      // Handle parcel points response and trigger onSelectPoint callback
      boxtalMaps.onSearchParcelPointsResponse((points) => {
        if (points && points.length > 0) {
          console.log('Parcel points found:', points);
          onSelectPoint(points[0]); // Send the first point to onSelectPoint callback
        }
      });
    }
  }, [boxtalLoaded, accessToken, onSelectPoint]);

  return (
    <>
      <Script
        src="https://maps.boxtal.com/app/v3/assets/js/boxtal-maps.js"
        strategy="lazyOnload"
        onLoad={() => setBoxtalLoaded(true)}
        onError={() => console.error('Failed to load Boxtal Maps script.')}
      />
      <div id="parcel-point-map" style={{ width: '100%', height: '200px' }}></div>
    </>
  );
};

export default BoxtalMap;
