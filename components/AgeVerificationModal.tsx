'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Empêcher le défilement du body quand le modal est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAccept = () => {
    setIsOpen(false);
    localStorage.setItem('ageVerified', 'true');
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl text-center">
        <Image
          src="/images/logo2.png"
          alt="Logo Mémé Georgette"
          className="mx-auto mb-6"
          width={160}
          height={200}
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Vérification de l&apos;âge {/* Apostrophe échappée */}
        </h2>
        <p className="text-gray-600 mb-6">
          Ce site est réservé aux personnes majeures. En entrant sur ce site, vous certifiez avoir 18 ans ou plus.
        </p>
        <div className="space-y-3">
          <button
            onClick={handleAccept}
            className="w-full bg-orange-400 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors"
          >
            Je certifie avoir plus de 18 ans
          </button>
          <button
            onClick={handleReject}
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors"
          >
            J&apos;ai moins de 18 ans {/* Apostrophe échappée */}
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération. {/* Apostrophes échappées */}
        </p>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
