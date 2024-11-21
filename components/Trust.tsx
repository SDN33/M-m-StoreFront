import React from 'react';
import Image from 'next/image';
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden h-[300px] relative">
      <video
        src="/videos/newslettervid.mp4"
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Newsletter
        </h2>
        <p className="text-lg mb-1 text-center">Des offres exclusives, des nouveautés...</p>
        <p className="font-semibold mb-4 text-center">Parole de Mémé, on ne spamme pas !</p>
        <form onSubmit={handleSubscribe} className="w-full max-w-md">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white/90 text-gray-800 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-primary to-rose-800 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-800 hover:text-white py-3 px-6 rounded whitespace-nowrap"
            >
              S&apos;inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MemeGeorgettePremium = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white">
      {/* Caractéristiques */}
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-bounce">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
              {/* Planète */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100" height="100">
                <path d="M2.84375 13C1.273438 13 0 14.277344 0 15.84375L0 42C0 43.566406 1.429688 45 3 45L7.09375 45C7.570313 47.835938 10.03125 50 13 50C15.96875 50 18.429688 47.835938 18.90625 45L28.15625 45C29.722656 45 31 43.722656 31 42.15625L31 15.90625C31 14.304688 29.738281 13 28.1875 13 Z M 33 20L33 45C33.480469 47.832031 36.03125 50 39 50C41.96875 50 44.429688 47.832031 44.90625 45L47 45C48.570313 45 50 43.570313 50 42L50 32.375C50 30.363281 48.550781 28.308594 48.375 28.0625L44.21875 22.5C43.265625 21.351563 41.769531 20 40 20 Z M 38 25L43.59375 25L46.78125 29.25C47.121094 29.730469 48 31.203125 48 32.375L48 33L38 33C37 33 36 32 36 31L36 27C36 25.894531 37 25 38 25 Z M 13 40C15.207031 40 17 41.792969 17 44C17 46.207031 15.207031 48 13 48C10.792969 48 9 46.207031 9 44C9 41.792969 10.792969 40 13 40 Z M 39 40C41.207031 40 43 41.792969 43 44C43 46.207031 41.207031 48 39 48C36.792969 48 35 46.207031 35 44C35 41.792969 36.792969 40 39 40Z" fill=""/>
              </svg>

              {/* Grande feuille verte */}
              <path
              d="M60,25
                 C75,15 85,25 85,40
                 C85,55 75,65 60,55
                 C65,45 65,35 60,25 Z"
              fill="#4CAF50"
              />
              {/* Tige */}
              <path
              d="M60,55 L55,65"
              stroke="#4CAF50"
              strokeWidth="3"
              fill="none"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Livraison éco-responsable</h3>
          <p className="text-gray-600">Un délai un peu plus long pour un impact moindre sur notre planète</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">+ de 2 500 références</h3>
          <p className="text-gray-600">Nous travaillons pour vous proposer le meilleur catalogue de vins bio !</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-bounce">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
              {/* Verre de dégustation */}
              <path d="M40,20 C40,20 30,35 30,50 C30,65 45,70 50,70 C55,70 70,65 70,50 C70,35 60,20 60,20 Z" />
              <rect x="48" y="70" width="4" height="10" />
              <path d="M40,80 L60,80 L55,85 L45,85 Z" />
              <path d="M35,45 C35,45 45,50 65,45" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="70" cy="30" r="8" fillOpacity="0.2" />
              <text x="70" y="33" fontSize="10" fill="currentColor" textAnchor="middle">A+</text>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Sélection de qualité</h3>
          <p className="text-gray-600">Nos vins sont sélectionnés et controler par nos experts</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-primary">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <path d="M3.3 7L12 12.6 20.7 7"/>
              <path d="M12 22V12.6"/>
              <path d="M7 4.1L12 7l5-2.9"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Emballages</h3>
          <p className="text-gray-600">Chez Mémé, pas de casse ! Nous emballons vos bouteilles avec soin</p>
        </div>
      </div>

      {/* Sections Découvrir */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="relative overflow-hidden rounded-lg">
          <Newsletter />
        </div>

        <div className="relative overflow-hidden rounded-lg group">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image
            src="/images/winery.jpg"
            alt="Producteurs"
            className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-500"
            width={800}
            height={300}
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white">
            <h2 className="text-sm md:text-base font-bold mb-4">VOUS ÊTES UN VIGNERON ?</h2>
            <a className="text-base text-center bg-white text-gray-800 px-8 py-2 rounded hover:bg-gray-100 transition-colors" href="/portailpro">
              DÉCOUVRIR NOTRE <strong className="text-primary">PORTAIL PRO</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGeorgettePremium;
