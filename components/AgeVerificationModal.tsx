'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAccept = () => {
    setIsOpening(true);
    localStorage.setItem('ageVerifiedTime', new Date().getTime().toString());
    setTimeout(() => {
      setIsOpen(false);
      setIsOpening(false);
      setShouldRender(false);
    }, 2000); // Durée totale de l'animation
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Vidéo de fond */}
      <video
        className="absolute inset-0 object-cover w-full h-full overflow-auto"
        autoPlay
        loop
        muted
      >
        <source src="./videos/newslettervid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Conteneur principal avec les portes */}
      <div className="absolute inset-0 flex">
        {/* Porte gauche */}
        <div
          className={`absolute top-0 bottom-0 w-1/2 left-0 bg-transparent transition-transform duration-[1.5s] ease-in-out transform
            ${isOpening ? '-translate-x-full' : 'translate-x-0'}`}
        >
          {/* Bordure décorative droite */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-800"></div>
        </div>

        {/* Porte droite */}
        <div
          className={`absolute top-0 bottom-0 w-1/2 right-0 bg-transparent transition-transform duration-[1.5s] ease-in-out transform
            ${isOpening ? 'translate-x-full' : 'translate-x-0'}`}
        >
          {/* Bordure décorative gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-800"></div>
        </div>
      </div>

      {/* Contenu du modal */}
      <div
        className={`relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl text-center m-4
          transition-all duration-500 ${isOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
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
  );
};

export default AgeVerificationModal;
