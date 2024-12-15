'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import Image from 'next/image';

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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startInactivityTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowRecentSearches(false);
    }, 4000);
  }, []);

  const handleMouseMove = useCallback(() => {
    if (showRecentSearches) startInactivityTimer();
  }, [showRecentSearches, startInactivityTimer]);

  const extractMetaData = useCallback((product: Product): FilteredProduct => {
    const metaDataMap: { [key: string]: string } = {};
    const metaKeys = {
      '_nom_chateau': 'nom_chateau',
      '_appellation': 'appellation',
      '_millesime': 'millesime',
      '_region': 'region__pays',
      '_couleur': 'categorie',
    };

    product.meta_data.forEach(meta => {
      const mappedKey = metaKeys[meta.key as keyof typeof metaKeys];
      if (mappedKey) metaDataMap[mappedKey] = meta.value;
    });

    return { ...product, ...metaDataMap };
  }, []);

  const normalizeString = useCallback((str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')  // Simplifié
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  const getSimilarityScore = useCallback((input: string, product: FilteredProduct): number => {
    const normalizedInput = normalizeString(input);
    const searchWords = normalizedInput.split(' ').filter(word => word.length > 1);

    if (searchWords.length === 0) return 0;

    const fieldsToSearch = [
      product.name,
      product.nom_chateau,
      product.appellation,
      product.millesime,
      product.region__pays,
      product.categorie,
    ]
      .filter(Boolean)
      .map(str => normalizeString(str as string));

    let matches = 0;
    searchWords.forEach(word => {
      if (fieldsToSearch.some(field => field.includes(word))) matches++;
    });

    return matches / searchWords.length;
  }, [normalizeString]);

  const filterResults = useCallback((products: FilteredProduct[], term: string): FilteredProduct[] => {
    return products
      .map(product => ({ product, score: getSimilarityScore(term, product) }))
      .filter(({ score }) => score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ product }) => product);
  }, [getSimilarityScore]);

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
            params: { search: term, per_page: 20, status: 'publish', orderby: 'relevance' },
          });

          const processedResults = response.data.map(extractMetaData);
          const filteredResults = filterResults(processedResults, term);
          setResults(filteredResults);

          if (term.trim()) {
            setRecentSearches(prev => {
              const updated = [term, ...prev.filter(s => s !== term)].slice(0, 5);
              localStorage.setItem('recentSearches', JSON.stringify(updated));
              return updated;
            });
          }
        } catch {
          setError('Une erreur est survenue lors de la recherche');
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [extractMetaData, filterResults]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setError(null);
    debouncedSearch(term);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !resultsRef.current?.contains(event.target as Node) &&
        !recentSearchesRef.current?.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setResults([]);
        setShowRecentSearches(false);
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setShowRecentSearches(false);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []); // Nettoyage du timer à la destruction du composant

  return (
    <div className="relative flex-grow mx-4 max-w-3xl shadow-sm">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowRecentSearches(true)}
          onMouseMove={handleMouseMove}
          placeholder="Rechercher un vin, un château ..."
          className="w-full pl-4 pr-20 py-3 border rounded-full text-sm bg-white border-gray-300 text-gray-900 focus:outline-none focus:border-orange-500 placeholder:text-gray-500"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500" />
          ) : (
          <div className="flex items-center">
            <p className='border-r border-gray-500 text-transparent mr-2'>|</p>
            <Search className="w-5 h-5 mr-1 text-gray-600" />
          </div>
          )}
          {searchTerm && (
        <button
          onClick={clearSearch}
          className="p-1 hover:bg-white rounded-full"
        >
          <X className="w-4 h-4 text-gray-600" />
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
        <div
          ref={resultsRef}
          className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-20 max-h-96 overflow-y-auto"
          onMouseMove={handleMouseMove}
        >
          {results.map((product, index) => (
            <a
              key={product.id}
              href={`/produits/${product.id}`}
              className={`flex items-center p-4 hover:bg-gray-50 ${index !== results.length - 1 ? 'border-b' : ''}`}
            >
              {product.images[0] && (
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  className="object-cover rounded"
                  width={48}
                  height={48}
                  loading="lazy"  // Chargement différé
                  placeholder="blur"
                  blurDataURL="/placeholder.png"  // Optionnel : image de placeholder
                />
              )}
              <div className="ml-4 flex-grow">
                <h4 className="font-semibold text-gray-950">{product.name}</h4>
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
        <div
          ref={recentSearchesRef}
          className="absolute mt-2 w-full bg-gray-100 rounded-lg shadow-lg p-4 z-20"
          onMouseMove={handleMouseMove}
        >
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
