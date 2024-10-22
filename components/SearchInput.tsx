'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  nom_du_chateau: string;
}

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [filteredAnswer, setFilteredAnswer] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<string[]>([]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(`/api/products?search=${searchTerm}`);
      const data: Product[] = response.data;

      console.log('Résultats de l\'API:', data); // Log des résultats de l'API

      // Tri des résultats
      data.sort((a, b) => (a.name > b.name ? 1 : -1));

      setResults(data);
      setFilteredAnswer(null); // Réinitialiser la réponse filtrée
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setFilteredAnswer("Erreur lors de la recherche."); // Message d'erreur à l'utilisateur
    }
  };

  const normalizeString = (str: string) => str.toLowerCase().replace(/\s+/g, '');

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = normalizeString(event.target.value);
    setSearchTerm(query);

    console.log('Requête de recherche normalisée:', query); // Log de la requête normalisée

    // Filtrer les résultats
    const foundResults = results.filter(result =>
      normalizeString(result.name).includes(query) ||
      normalizeString(result.nom_du_chateau).includes(query)
    );

    console.log('Résultats filtrés:', foundResults); // Log des résultats filtrés

    if (foundResults.length > 0) {
      setFilteredAnswer(`Trouvé : ${foundResults.map(r => r.name).join(', ')}`);
    } else {
      setFilteredAnswer("Aucun produit trouvé correspondant à votre recherche.");
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  return (
    <div className="relative max-w-md w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Rechercher un vin ou un château..."
          value={searchTerm}
          onChange={handleFilter}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-800"
        />
        <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800">
          <Search className="w-6 h-6" />
        </button>
      </form>

      {/* Affichage des résultats de recherche */}
      {results.length > 0 && (
        <ul className="absolute mt-2 w-full bg-gray-100 rounded-md shadow-lg py-1 z-30">
          {results.map((result, index) => (
            <li key={result.id}>
              <a
                href={`/products/${result.id}`}
                className={`block px-4 py-2 text-sm text-gray-800 ${
                  index === 0 ? 'bg-orange-600 text-white font-semibold' : 'hover:bg-orange-600'
                }`}
              >
                <span className="font-semibold">{result.name}</span>
                {result.nom_du_chateau && (
                  <span className="text-gray-500"> - {result.nom_du_chateau}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
      {/* Affichage de la réponse filtrée */}
      <div className="mt-2">
        {filteredAnswer && (
          <p className="text-gray-700 text-base leading-relaxed">{filteredAnswer}</p>
        )}
      </div>

      {/* Section de filtres */}
      <div className="relative mt-4">
        <p className="mt-4 px-4 text-black font-bold">Filtrer par :</p>
        {['couleur', 'région', 'vintage', 'certification', 'style'].map(filterType => (
          <div key={filterType} className="border-b border-gray-200">
            <button
              onClick={() => toggleSection(filterType)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
              aria-expanded={openSections.includes(filterType)}
              aria-controls={filterType}
            >
              <span className="font-semibold">{filterType}</span>
            </button>
            {openSections.includes(filterType) && (
              <div className="px-4 py-2 max-h-48 overflow-y-auto bg-gray-100">
                {/* Ici vous pouvez ajouter vos options de filtre */}
                <label className="flex items-center space-x-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Option 1</span>
                </label>
                {/* Ajoutez d'autres options selon vos besoins */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchInput;
