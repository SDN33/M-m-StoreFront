'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || '';

const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

const decrypt = (hash: string) => {
  const bytes = CryptoJS.AES.decrypt(hash, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

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
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  // Garde la même logique useEffect...
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        const decryptedUser = decrypt(cachedUser);
        setUser(JSON.parse(decryptedUser));
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        localStorage.removeItem('user');
      }
      setLoading(false);
    }

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
          localStorage.setItem('user', encrypt(JSON.stringify(data)));
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
      localStorage.removeItem('user');
      router.push('/login');
    } catch {
      setError('Failed to logout. Please try again.');
    }
  };

  const handleUpdateAddress = () => {
    if (user) {
      const updatedUser = { ...user, billing_address: newBillingAddress, shipping_address: newShippingAddress };
      setUser(updatedUser);
      localStorage.setItem('user', encrypt(JSON.stringify(updatedUser)));
      setNewBillingAddress('');
      setNewShippingAddress('');
      setIsEditMode(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-36">
      <div className="max-w-3xl mx-auto">
        {/* En-tête du profil */}
        <div className="bg-white rounded-t-2xl shadow-sm p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.user_display_name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.user_display_name}</h1>
                <p className="text-gray-500">{user?.user_email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-b-2xl shadow-sm p-8">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Informations d'adresse */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informations d'adresse</h2>
              {!isEditMode ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Adresse de facturation</p>
                    <p className="text-gray-900">{user?.billing_address || 'Non renseignée'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Adresse de livraison</p>
                    <p className="text-gray-900">{user?.shipping_address || 'Non renseignée'}</p>
                  </div>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Modifier les adresses
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-1">
                      Nouvelle adresse de facturation
                    </label>
                    <input
                      type="text"
                      id="billing_address"
                      value={newBillingAddress}
                      onChange={(e) => setNewBillingAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez votre nouvelle adresse de facturation"
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                      Nouvelle adresse de livraison
                    </label>
                    <input
                      type="text"
                      id="shipping_address"
                      value={newShippingAddress}
                      onChange={(e) => setNewShippingAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez votre nouvelle adresse de livraison"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleUpdateAddress}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setNewBillingAddress('');
                        setNewShippingAddress('');
                      }}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
