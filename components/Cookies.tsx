'use client';

import React, { useEffect, useState } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const ageVerifiedTime = localStorage.getItem('ageVerifiedTime');
    const consent = localStorage.getItem('cookieConsent');

    const handleAgeVerification = () => {
      if (!consent) {
        setIsVisible(true);
      }
    };

    window.addEventListener('ageVerified', handleAgeVerification);

    if (ageVerifiedTime) {
      const currentTime = new Date().getTime();
      const verificationTime = parseInt(ageVerifiedTime);

      if (currentTime - verificationTime < 6 * 60 * 60 * 1000) {
        if (!consent) {
          setIsVisible(true);
        }
      }
    }

    return () => {
      window.removeEventListener('ageVerified', handleAgeVerification);
    };
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
    if (type === 'essential') return;
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!isVisible) return null;

  if (showDetails) {
    return (
      <div className="fixed inset-0 bg-white backdrop-blur-md z-50 flex items-center justify-center p-4 pb-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto border border-primary/20">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-black">🍪 Paramètres des cookies</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-black hover:text-primary transition-colors rounded-full p-2 hover:bg-primary/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Cookies essentiels</p>
                    <p className="text-sm text-primary/70">Nécessaires au fonctionnement du site</p>
                  </div>
                  <div className="bg-primary/20 px-3 py-1 rounded-full text-sm text-primary">
                    Activé
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Cookies analytiques</p>
                    <p className="text-sm text-primary/70">Mesure d&apos;audience et statistiques</p>
                  </div>
                  <button
                    onClick={() => handleToggle('analytics')}
                    className={`w-14 h-7 rounded-full transition-colors relative ${
                      preferences.analytics ? 'bg-primary' : 'bg-primary/20'
                    }`}
                  >
                    <span className={`absolute block w-5 h-5 rounded-full bg-white top-1 transition-transform ${
                      preferences.analytics ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Cookies marketing</p>
                    <p className="text-sm text-primary/70">Personnalisation et publicités</p>
                  </div>
                  <button
                    onClick={() => handleToggle('marketing')}
                    className={`w-14 h-7 rounded-full transition-colors relative ${
                      preferences.marketing ? 'bg-primary' : 'bg-primary/20'
                    }`}
                  >
                    <span className={`absolute block w-5 h-5 rounded-full bg-white top-1 transition-transform ${
                      preferences.marketing ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-primary/10">
              <button
                onClick={refuse}
                className="px-4 py-2 text-sm text-primary/70 hover:bg-primary/10 rounded-md transition-colors"
              >
                Tout refuser
              </button>
              <button
                onClick={acceptSelected}
                className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
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
    <div className="fixed bottom-0 z-50 w-full h-fit">
      <div className="bg-black/90 backdrop-blur-sm rounded-t-xl shadow-lg border border-primary/10 p-4 ">
        <div className="space-y-4">
          <p className="text-center flex items-center justify-center gap-3">
            <span className='text-3xl font-bold text-left'>🍪</span>
            <span className='font-normal text-white'>Nous utilisons des cookies pour améliorer votre expérience client et nos services.<br /><span className='text-xs sm:hidden md:flex lg:flex '>Selon la législation en vigueur, vous pouvez accepter ou refuser ces cookies</span></span>
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={acceptAll}
              className="px-5 py-2 bg-white  shadow-xl rounded-md transition-colors font-medium"
            >
              Tout accepter
            </button>
            <button
              onClick={() => setShowDetails(true)}
              className="px-5 py-2 bg-white shadow-xl rounded-md transition-colors font-medium"
            >
              Personnaliser
            </button>
            <button
              onClick={refuse}
              className="px-5 py-2 bg-black text-white rounded-md transition-colors font-medium"
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
