'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface User {
  user_display_name: string;
  user_email: string;
  billing_address: string;
  shipping_address: string;
}

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBillingAddress, setNewBillingAddress] = useState<string>('');
  const [newShippingAddress, setNewShippingAddress] = useState<string>('');
  const router = useRouter();

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const validateAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Récupérer les données de l'utilisateur depuis localStorage, si elles existent
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setLoading(false); // Fin du chargement dès qu'on a les données du localStorage
    }

    // Si l'utilisateur n'est pas dans le cache, appeler l'API
    async function fetchUserData() {
      try {
        setError(null);
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
          // Sauvegarder les informations dans le localStorage
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          if (response.status === 401) {
            router.push('/login');
          } else {
            setError('Failed to fetch profile data. Please try again later.');
          }
        }
      } catch {
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (!cachedUser) {
      fetchUserData();
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user'); // Retirer les informations de l'utilisateur du localStorage
      router.push('/login');
    } catch {
      setError('Failed to logout. Please try again.');
    }
  };

  const handleUpdateAddress = async () => {
    const isBillingAddressValid = await validateAddress(newBillingAddress);
    const isShippingAddressValid = await validateAddress(newShippingAddress);

    if (isBillingAddressValid && isShippingAddressValid) {
      if (user) {
        // Mettre à jour les adresses dans l'état local
        const updatedUser = { ...user, billing_address: newBillingAddress, shipping_address: newShippingAddress };
        setUser(updatedUser);

        // Sauvegarder les nouvelles adresses dans le localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setNewBillingAddress('');
        setNewShippingAddress('');
      }
    } else {
      setError('Une ou plusieurs des adresses ne sont pas valides. Veuillez les vérifier.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-75"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 mt-48 mb-56 bg-gradient-to-b from-white to-orange-50">
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-bold text-gray-800">
          Bienvenue <br /> {user?.user_display_name}
        </h1>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {user && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">{user.user_display_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.user_email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Adresse de facturation:</span>
                <span className="font-medium">{user.billing_address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Adresse de livraison:</span>
                <span className="font-medium">{user.shipping_address}</span>
              </div>
            </div>

            {/* Formulaire de modification d'adresses */}
            <div className="space-y-4">
              <div>
                <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700">
                  Modifier l&apos;adresse de facturation
                </label>
                <input
                  type="text"
                  id="billing_address"
                  value={newBillingAddress}
                  onChange={(e) => setNewBillingAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">
                  Modifier l&apos;adresse de livraison
                </label>
                <input
                  type="text"
                  id="shipping_address"
                  value={newShippingAddress}
                  onChange={(e) => setNewShippingAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <button
                onClick={handleUpdateAddress}
                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Mettre à jour les adresses
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Se déconnecter
            </button>
          </div>
        )}

        {!user && !loading && (
          <p className="text-center text-gray-600 ">Redirection en cours...</p>
        )}
      </div>
    </main>
  );
}
