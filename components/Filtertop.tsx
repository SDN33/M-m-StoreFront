import React, { useState } from 'react';

interface FiltertopProps {
  sortBy: string;
  handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  resetFilters: () => void;
}

const Filtertop: React.FC<FiltertopProps> = ({ sortBy = '', handleSortChange, resetFilters }) => {
  const [priceRange, setPriceRange] = useState<string>(''); // État pour la plage de prix

  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceRange(event.target.value);
    // Vous pouvez ici appeler une fonction pour gérer le filtrage par prix, si nécessaire
  };

  return (
    <div className="flex mx-auto text-center items-center justify-center mt-8 -mb-6">
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
        <option value="">{sortBy ? "Désactiver" : "Choisir une option"}</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
      </select>

    </div>
  );
};

export default Filtertop;
