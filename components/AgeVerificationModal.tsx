'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const ageVerifiedTime = localStorage.getItem('ageVerifiedTime');

    if (ageVerifiedTime) {
      const currentTime = new Date().getTime();
      const verificationTime = parseInt(ageVerifiedTime);

      if (currentTime - verificationTime < 6 * 60 * 60 * 1000) {
        setShouldRender(false);
      } else {
        setShouldRender(true);
        localStorage.removeItem('ageVerifiedTime');
      }
    } else {
      setShouldRender(true);
    }
  }, []);

  useEffect(() => {
    if (shouldRender) {
      setIsOpen(true);
    }
  }, [shouldRender]);

  const handleAccept = () => {
    setIsFading(true);
    localStorage.setItem('ageVerifiedTime', new Date().getTime().toString());
    setTimeout(() => {
      setIsOpen(false);
      setShouldRender(false);
    }, 2000); // Durée de la transition
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Conteneur avec effet de flou */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-50 backdrop-blur-lg transition-opacity duration-2000 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden={!isOpen}
      ></div>

      {/* Contenu du modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className={`relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl text-center m-4
            transition-all duration-500 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          <Image
            src="/images/memelogo2.png"
            alt="Vérification de l'âge"
            width={150}
            height={150}
            className="mx-auto mb-4"
            priority={true}
            quality={100}
          />
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Vérification de l&apos;âge
          </h2>
          <p className="text-gray-600 mb-6 font-serif">
            Ce site est réservé aux personnes majeures.<br />
            En entrant sur ce site, vous certifiez<br />
            <span className="font-serif font-bold text-primary">avoir 18 ans ou plus</span>.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              className="w-full bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors"
            >
              Je certifie avoir plus de 18 ans
            </button>
            <button
              onClick={handleReject}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors"
            >
              J&apos;ai moins de 18 ans
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500 font-serif">
            L&apos;abus d&apos;alcool est dangereux pour la santé.<br />
            À consommer avec modération.
          </p>
        </div>
      </div>
    </>
  );
};

export default AgeVerificationModal;
