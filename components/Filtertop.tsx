'use client';
import React from 'react';

interface FiltertopProps {
  sortBy: string;
  handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  resetFilters: () => void;
}

const Filtertop: React.FC<FiltertopProps> = ({ sortBy, handleSortChange, resetFilters }) => {
  return (
    <div className="flex flex-col items-center sm:flex-row sm:justify-center md:justify-end mr-4">
      <div className="text-lg flex items-center justify-center mb-2 sm:mb-0">
        <label className="mr-2 font-bold text-gray-600">+ de 120 vignerons</label>
        <span className="mx-2 font-bold text-primary">| </span>
        <label className="mr-2 font-bold text-gray-600">+ de 1000 vins</label>
      </div>

      <span className="mx-2 font-bold text-primary hidden sm:inline">|</span>

      <label htmlFor="sortBySelect" className="mr-2 font-bold text-gray-800 hidden sm:inline">
        Trier par :
      </label>

      <select
        id="sortBySelect"
        value={sortBy}
        onChange={handleSortChange}
        className="border rounded px-2 py-1"
        aria-label="Trier les produits par"
      >
        <option value="">Choisir une option</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="rating">Note</option>
      </select>

      <button
        onClick={resetFilters}
        className="ml-4 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white  px-4 py-2 rounded transition duration-300"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
};

export default Filtertop;
