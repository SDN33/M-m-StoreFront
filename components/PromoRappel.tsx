import React from 'react';

const PromoRappel = () => {
  return (
    <>
      {/* Bannière promotionnelle */}
      <div className="bg-black text-white p-4 text-center rounded-lg">
        <p className="text-lg">
          🌟 <span className='text-accent'>PROMOS DE MÉMÉ </span> &gt; RETROUVEZ NOS PRODUITS PRÉFÉRÉS À PRIX CASSÉS
          <button className="ml-4 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-1 rounded hover:from-red-500 hover:to-rose-600 transition-colors">
            EN PROFITER &rsaquo;
          </button>
        </p>
      </div>
    </>
  );
};

export default PromoRappel;
