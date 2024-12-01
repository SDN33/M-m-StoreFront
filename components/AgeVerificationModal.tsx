'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const AgeVerificationModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Prevent initial flash by delaying render check
    const checkAgeVerification = () => {
      const ageVerifiedTime = localStorage.getItem('ageVerifiedTime');

      if (ageVerifiedTime) {
        const currentTime = new Date().getTime();
        const verificationTime = parseInt(ageVerifiedTime);

        if (currentTime - verificationTime < 6 * 60 * 60 * 1000) {
          setShouldRender(false);
        } else {
          localStorage.removeItem('ageVerifiedTime');
          setShouldRender(true);
        }
      } else {
        setShouldRender(true);
      }
    };

    // Use setTimeout to ensure initial render is complete
    const timer = setTimeout(() => {
      checkAgeVerification();

      // If modal should render, fade it in
      if (shouldRender) {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [shouldRender]);

  const handleAccept = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('ageVerifiedTime', currentTime.toString());
    localStorage.setItem('cookieConsent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false
    }));

    setIsVisible(false);

    // Delay removing from DOM to allow fade-out
    setTimeout(() => {
      setShouldRender(false);
      window.dispatchEvent(new Event('ageVerified'));
    }, 500);
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  // Prevent rendering if not needed
  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-500 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        pointer-events-${isVisible ? 'auto' : 'none'}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950 bg-opacity-50 backdrop-blur-sm"
        onClick={handleReject}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-lg max-w-md p-6 shadow-xl text-center m-4
          transition-all duration-500 ease-in-out transform
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <Image
          src="https://res.cloudinary.com/daroyxenr/image/upload/q_auto:eco/v1732631587/bloc-marque-filet_technique_01_3_2_1_yzobd5.webp"
          alt="Vérification de l'âge"
          width={150}
          height={150}
          className="mx-auto mb-4"
          priority={true}
          quality={100}
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease-in-out'
          }}
        />
        <h2 className="text-xl font-bold text-gray-950 mb-4">
          Vérification de l&apos;âge
        </h2>
        <p className="text-gray-950 mb-6 font-serif">
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
        <p className="mt-4 text-sm text-gray-950 font-serif">
          L&apos;abus d&apos;alcool est dangereux pour la santé.<br />
          À consommer avec modération.
        </p>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
