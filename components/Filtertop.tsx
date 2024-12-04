import React from 'react';

interface FiltertopProps {
  sortBy: string;
  handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  resetFilters: () => void;
}

const Filtertop: React.FC<FiltertopProps> = ({ sortBy = '', handleSortChange }) => {
  return (
    <div className="flex mx-auto text-center items-center justify-center pt-4 mt-4 -mb-6 rounded-t-xl bg-gray-100 pb-4 pr-0 lg:pr-16 w-full">
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
