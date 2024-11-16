'use client';

import React, { useEffect, useState } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Toujours true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(prev => ({
          ...prev,
          ...savedPreferences
        }));
      } catch (e) {
        console.error('Failed to parse cookie consent:', e);
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allPreferences));
    setPreferences(allPreferences);
    setIsVisible(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowDetails(false);
  };

  const refuse = () => {
    const minimalPreferences = {
      essential: true,
      analytics: false,
      marketing: false
    };
    localStorage.setItem('cookieConsent', JSON.stringify(minimalPreferences));
    setPreferences(minimalPreferences);
    setIsVisible(false);
  };

  const handleToggle = (type: 'essential' | 'analytics' | 'marketing') => {
    if (type === 'essential') return; // Ne peut pas être désactivé
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!isVisible) return null;

  if (showDetails) {
    return (
      <div className="fixed inset-0 bg-gray-200/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto border border-gray-300">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">🍪 Paramètres des cookies</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-gray-100 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Cookies essentiels</p>
                    <p className="text-sm text-gray-600">Nécessaires au fonctionnement du site</p>
                  </div>
                  <div className="bg-gray-300 px-2 py-1 rounded text-sm text-gray-700">
                    Activé
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-100 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Cookies analytiques</p>
                    <p className="text-sm text-gray-600">Mesure d&apos;audience et statistiques</p>
                  </div>
                  <button
                    onClick={() => handleToggle('analytics')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      preferences.analytics ? 'bg-[#ff7961]' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute block w-4 h-4 rounded-full bg-white top-1 transition-transform ${
                      preferences.analytics ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-gray-100 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Cookies marketing</p>
                    <p className="text-sm text-gray-600">Personnalisation et publicités</p>
                  </div>
                  <button
                    onClick={() => handleToggle('marketing')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      preferences.marketing ? 'bg-[#ff7961]' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute block w-4 h-4 rounded-full bg-white top-1 transition-transform ${
                      preferences.marketing ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={refuse}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Tout refuser
              </button>
              <button
                onClick={acceptSelected}
                className="px-4 py-2 text-sm bg-[#ff7961] text-white rounded hover:bg-[#ff6347]"
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:max-w-lg mx-auto">
      <div className="bg-accent rounded-lg shadow-lg border border-gray-100 p-4 text-sm bg-opacity-90">
        <div className="space-y-3">
          <p className="text-black text-center">
            <span className='text-3xl'>🍪</span>Nous utilisons des cookies pour améliorer votre expérience client.<br />Veuillez accepter nos cookies pour continuer.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={acceptAll}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Tout accepter
            </button>
            <button
              onClick={() => setShowDetails(true)}
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Personnaliser
            </button>
            <button
              onClick={refuse}
              className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
