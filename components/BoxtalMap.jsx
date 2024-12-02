// path: components/BoxtalMap.jsx
import Script from 'next/script';
import { useEffect, useState } from 'react';

const BoxtalMap = ({ onSelectPoint }) => {
  const [boxtalLoaded, setBoxtalLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/get-boxtal-token');
        const data = await res.json();
        if (data?.token) {
          setAccessToken(data.token);
        } else {
          throw new Error('Token manquant.');
        }
      } catch (err) {
        setError('Erreur lors du chargement de la map Boxtal');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  const handleSearch = () => {
    if (!boxtalLoaded || !accessToken) {
      setError("La carte n'est pas encore prête.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const boxtalMaps = new BoxtalMaps({
        domToLoadMap: '#parcel-point-map',
        accessToken,
        config: {
          locale: 'fr',
          parcelPointNetworks: [
            { code: 'MONR_NETWORK', markerTemplate: { color: '#94a1e8' } },
            { code: 'CHRP_NETWORK', markerTemplate: { color: '#FF4500' } },
          ],
          options: { primaryColor: '#00FA9A', autoSelectNearestParcelPoint: true },
        },
        onMapLoaded: () => {
          console.log('Carte Boxtal chargée.');
          boxtalMaps.searchParcelPoints(
            { country: 'FR', zipCode: postcode, city, street: address },
            (point) => {
              console.log('Point relais sélectionné :', point);
              setSelectedPoint(point);
            }
          );
        },
      });

      boxtalMaps.onSearchParcelPointsResponse((points) => {
        setLoading(false);
        if (points.length > 0) {
          console.log('Points relais trouvés :', points);
        } else {
          setError('Aucun point relais trouvé.');
        }
      });
    } catch (err) {
      setError("Erreur lors de l'initialisation de la carte.");
      console.error(err);
      setLoading(false);
    }
  };

  const handleSelectPoint = () => {
    if (selectedPoint) {
      onSelectPoint({
        name: selectedPoint.name,
        address: selectedPoint.address,
        city: selectedPoint.city,
        postcode: selectedPoint.postcode,
      });
      alert(`Point relais sélectionné : ${selectedPoint.name}`);
    } else {
      alert('Veuillez sélectionner un point relais sur la carte.');
    }
  };

  return (
    <>
      <Script
        src="https://maps.boxtal.com/app/v3/assets/js/boxtal-maps.js"
        strategy="lazyOnload"
        onLoad={() => setBoxtalLoaded(true)}
        onError={() => setError('Échec du chargement du script Boxtal Maps.')}
      />
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Rechercher un point relais</h2>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Adresse (facultatif)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Code postal"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-teal-800 text-white rounded hover:bg-teal-700"
          >
            {loading ? 'Recherche en cours...' : 'Rechercher'}
          </button>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </div>
      <div id="parcel-point-map" style={{ width: '100%', height: '400px', marginTop: '1rem' }}></div>
      <button
        className="mt-4 bg-teal-800 text-white p-3 rounded hover:bg-teal-900"
        onClick={handleSelectPoint}
      >
        Choisir ce point relais
      </button>
    </>
  );
};

export default BoxtalMap;
