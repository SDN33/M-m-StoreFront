'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import debounce from 'lodash/debounce';

interface ProductMetaData {
  key: string;
  value: string;
}

interface Product {
  id: number;
  name: string;
  meta_data: ProductMetaData[];
  price: string;
  regular_price: string;
  sale_price: string;
  categories: Array<{ id: number; name: string }>;
  images: Array<{ src: string }>;
}

interface FilteredProduct extends Product {
  nom_chateau?: string;
  appellation?: string;
  millesime?: string;
  region__pays?: string;
  categorie?: string;
}

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<FilteredProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const recentSearchesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Référence pour l'input de recherche

  const extractMetaData = (product: Product): FilteredProduct => {
    const metaDataMap: { [key: string]: string } = {};

    product.meta_data.forEach(meta => {
      switch (meta.key) {
        case '_nom_chateau':
          metaDataMap.nom_chateau = meta.value;
          break;
        case '_appellation':
          metaDataMap.appellation = meta.value;
          break;
        case '_millesime':
          metaDataMap.millesime = meta.value;
          break;
        case '_region':
          metaDataMap.region__pays = meta.value;
          break;
        case '_couleur':
          metaDataMap.categorie = meta.value;
          break;
      }
    });

    return {
      ...product,
      ...metaDataMap
    };
  };

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, " ")
      .trim();
  };

  const getSimilarityScore = (input: string, text: string) => {
    const normalizedInput = normalizeString(input);
    const normalizedText = normalizeString(text);

    const inputWords = normalizedInput.split(' ');
    const textWords = normalizedText.split(' ');

    const matches = inputWords.filter(word => textWords.includes(word)).length;
    return matches / inputWords.length;
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        if (term.length < 2) return;

        setIsLoading(true);
        try {
          const response = await axios.get('/api/products', {
            params: {
              search: term,
              per_page: 10,
              status: 'publish'
            }
          });

          const processedResults = response.data.map(extractMetaData);
          setResults(processedResults);

          setRecentSearches(prev => {
            const updated = [term, ...prev.filter(s => s !== term)].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
          });
        } catch (error) {
          console.error('Erreur de recherche:', error);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  const filterResults = (products: FilteredProduct[], term: string): FilteredProduct[] => {
    const normalizedTerm = normalizeString(term);
    const scoredResults = products
      .map(product => ({
        product,
        score: getSimilarityScore(normalizedTerm, product.name)
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredResults.map(({ product }) => product);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      debouncedSearch(term);
    } else {
      setResults([]);
    }
  };


  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2 && results.length) {
      const filtered = filterResults(results, searchTerm);
      setResults(filtered);
    }
  }, [results, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node) &&
        recentSearchesRef.current &&
        !recentSearchesRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) // Vérifiez également l'input
      ) {
        setShowFilters(false);
        setResults([]);
        setShowRecentSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex-grow mx-8 max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef} // Ajout de la référence à l'input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onMouseEnter={() => setShowRecentSearches(true)}
          onMouseLeave={() => setTimeout(() => setShowRecentSearches(false), 2000)}
          placeholder="Rechercher un vin, un château, une appellation..."
          className="w-full pl-4 pr-20 py-3 border rounded-full border-gray-400 text-primary focus:outline-none focus:border-orange-500"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div ref={filtersRef} className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg p-4 z-30">
          <div className="space-y-4">
            {/* Filtres ici */}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div ref={resultsRef} className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-20">
          {results.map((product, index) => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className={`flex items-center p-4 hover:bg-gray-50 ${index !== results.length - 1 ? 'border-b' : ''}`}
            >
              {product.images[0] && (
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="ml-4 flex-grow">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
              </div>
              <div className="ml-4 text-right">
                <div className="font-semibold text-primary">
                  {product.sale_price || product.regular_price}€
                </div>
                {product.sale_price && (
                  <div className="text-sm text-gray-400 line-through">
                    {product.regular_price}€
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      {!searchTerm && recentSearches.length > 0 && showRecentSearches && (
        <div ref={recentSearchesRef} className="absolute mt-2 w-full bg-white rounded-lg shadow-lg p-4 z-20">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Recherches récentes</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(term)}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
