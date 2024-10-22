'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Récupérer l'heure de validation dans localStorage
    const ageVerifiedTime = localStorage.getItem('ageVerifiedTime');

    if (ageVerifiedTime) {
      const currentTime = new Date().getTime();
      const verificationTime = parseInt(ageVerifiedTime);

      // Vérifier si moins de 6 heures se sont écoulées
      if (currentTime - verificationTime < 6 * 60 * 60 * 1000) {
        setIsOpen(false); // Moins de 6 heures, ne pas afficher le modal
      } else {
        setIsOpen(true); // Plus de 6 heures, réafficher le modal
        localStorage.removeItem('ageVerifiedTime'); // Supprimer la validation expirée
      }
    } else {
      setIsOpen(true); // Pas de validation, afficher le modal
    }
  }, []);

  useEffect(() => {
    // Empêcher le défilement quand le modal est ouvert
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAccept = () => {
    setIsOpen(false);
    // Stocker l'heure actuelle en tant que "timestamp"
    localStorage.setItem('ageVerifiedTime', new Date().getTime().toString());
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-lg max-w-md w-full p-6 shadow-xl text-center">
        <Image
          src="/images/logo2.png"
          alt="Logo Mémé Georgette"
          className="mx-auto mb-6"
          width={160}
          height={200}
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Vérification de l&apos;âge
        </h2>
        <p className="text-gray-600 mb-6 font-serif">
          Ce site est réservé aux personnes majeures.<br />En entrant sur ce site, vous certifiez<br /><span className='font-serif font-bold text-orange-600'>avoir 18 ans ou plus</span>.
        </p>
        <div className="space-y-3">
          <button
            onClick={handleAccept}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors"
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
          L&apos;abus d&apos;alcool est dangereux pour la santé.<br />À consommer avec modération.
        </p>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
