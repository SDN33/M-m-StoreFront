
const SpiritsPromo = () => {

  return (
    <div className="relative w-full h-40 overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900">
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center py-16">

        <h1 className="text-5xl font-bold text-white my-4">Spiritueux Bio</h1>
        <p className="text-xl text-gray-200 mb-8">Découvrez notre sélection de spiritueux d&apos;exception</p>

      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        .animate-fall {
          will-change: transform;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default SpiritsPromo;
