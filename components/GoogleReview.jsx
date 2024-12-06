import React from 'react';

const GoogleReview = () => {
  const googleReviewLink = 'https://g.page/r/CeblcZSGEi33EBM/review'; // Remplacez par l'URL spécifique de votre établissement

  return (
    <div className="bg-gray-100 border border-gray-200 p-6 rounded-lg shadow-md text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Vous avez apprécié nos services ? 😊
      </h2>
      <p className="text-gray-600 mb-6">
        Laissez-nous un avis sur Google pour nous aider à grandir et à mieux vous servir !
      </p>
      <a
        href={googleReviewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
      >
        Laisser un avis sur Google
      </a>
    </div>
  );
};

export default GoogleReview;
