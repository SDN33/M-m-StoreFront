// path: components/SearchInput.tsx

'use client';

import { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ id: number; name: string }[]>([]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(`/api/products?search=${searchTerm}`);
      setResults(response.data);
      // Gérer les résultats (affichage, redirection, etc.)
      console.log('Results:', response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Rechercher un vin..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-800"
      />
      <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800">
        <Search className="w-6 h-6" />
      </button>
      {/* Affichage des résultats de recherche (à personnaliser selon vos besoins) */}
      {results.length > 0 && (
        <ul className="absolute mt-2 w-full bg-white rounded-md shadow-lg py-1 z-30">
          {results.map((result) => (
            <li key={result.id}>
              <a href={`/products/${result.id}`} className="block px-4 py-2 text-sm text-gray-800 hover:bg-orange-600">
                {result.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchInput;
