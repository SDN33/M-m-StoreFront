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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const recentSearchesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fonction améliorée pour extraire les métadonnées
  const extractMetaData = (product: Product): FilteredProduct => {
    const metaDataMap: { [key: string]: string } = {};
    const metaKeys = {
      '_nom_chateau': 'nom_chateau',
      '_appellation': 'appellation',
      '_millesime': 'millesime',
      '_region': 'region__pays',
      '_couleur': 'categorie'
    };

    product.meta_data.forEach(meta => {
      const mappedKey = metaKeys[meta.key as keyof typeof metaKeys];
      if (mappedKey) {
        metaDataMap[mappedKey] = meta.value;
      }
    });

    return { ...product, ...metaDataMap };
  };

  // Normalisation améliorée des chaînes
  const normalizeString = (str: string) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Calcul du score de similarité amélioré
  const getSimilarityScore = (input: string, product: FilteredProduct): number => {
    const normalizedInput = normalizeString(input);
    const searchWords = normalizedInput.split(' ').filter(word => word.length > 1);

    if (searchWords.length === 0) return 0;

    const fieldsToSearch = [
      product.name,
      product.nom_chateau,
      product.appellation,
      product.millesime,
      product.region__pays,
      product.categorie
    ].filter(Boolean).map(str => normalizeString(str as string));

    let totalScore = 0;
    let matches = 0;

    searchWords.forEach(word => {
      fieldsToSearch.forEach(field => {
        if (field.includes(word)) {
          matches++;
          // Bonus pour les correspondances exactes
          if (field === word) matches += 0.5;
        }
      });
    });

    totalScore = matches / (searchWords.length * fieldsToSearch.length);
    return totalScore;
  };

  // Recherche améliorée avec gestion d'erreur
  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        if (term.length < 2) {
          setResults([]);
          return;
        }

        setIsLoading(true);
        setError(null);

        try {
          const response = await axios.get('/api/products', {
            params: {
              search: term,
              per_page: 20, // Augmenté pour plus de résultats
              status: 'publish',
              orderby: 'relevance'
            }
          });

          if (response.data.length === 0) {
            setError('Aucun résultat trouvé');
            setResults([]);
            return;
          }

          const processedResults = response.data.map(extractMetaData);
          const filteredResults = filterResults(processedResults, term);
          setResults(filteredResults);

          // Mise à jour des recherches récentes
          if (term.trim()) {
            setRecentSearches(prev => {
              const updated = [term, ...prev.filter(s => s !== term)].slice(0, 5);
              localStorage.setItem('recentSearches', JSON.stringify(updated));
              return updated;
            });
          }
        } catch (error) {
          console.error('Erreur de recherche:', error);
          setError('Une erreur est survenue lors de la recherche');
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  // Filtrage amélioré des résultats
  const filterResults = (products: FilteredProduct[], term: string): FilteredProduct[] => {
    return products
      .map(product => ({
        product,
        score: getSimilarityScore(term, product)
      }))
      .filter(({ score }) => score > 0.1) // Seuil minimum de pertinence
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Limite le nombre de résultats
      .map(({ product }) => product);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setError(null);
    debouncedSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setShowRecentSearches(false);
    setError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Gestion des clics à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        recentSearchesRef.current &&
        !recentSearchesRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setResults([]);
        setShowRecentSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Chargement initial des recherches récentes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des recherches récentes:', error);
    }
  }, []);

  return (
    <div className="relative flex-grow mx-8 max-w-xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowRecentSearches(true)}
          placeholder="Rechercher un vin, un château, une appellation..."
          className="w-full pl-4 pr-20 py-3 border rounded-full text-sm bg-slate-100 border-gray-400 text-primary focus:outline-none focus:border-orange-500"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-white rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {error && searchTerm && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg p-4 z-20">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div ref={resultsRef} className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-20 max-h-96 overflow-y-auto">
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
                <div className="font-semibold text-secondary">
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
        <div ref={recentSearchesRef} className="absolute mt-2 w-full bg-gray-100 rounded-lg shadow-lg p-4 z-20">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Recherches récentes</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchTerm(term);
                  debouncedSearch(term);
                }}
                className="px-3 py-1 bg-white rounded-full text-sm hover:bg-gray-200"
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
