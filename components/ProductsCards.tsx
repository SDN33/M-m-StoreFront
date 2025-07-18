import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Filtertop from './Filtertop';

interface Product {
  id: number;
  name: string;
  categories: { id: number; name: string }[];
  price: number;
  date_added: string;
  images: { src: string }[];
  millesime?: string;
  certification?: string;
  region__pays?: string;
  volume: string;
  style?: string;
  accord_mets?: string[];
  vendor: number;
  sale_price: number;
  regular_price: number;
  sans_sulfites_: string;
}

interface ProductsCardsProps {
  selectedFilters: {
    color: string[];
    region: string[];
    millesime: string[];
    certification: string[];
    style: string[];
    volume: string[];
    accord_mets: string[];
    region__pays: string[];
    categories: string[];
    sans_sulfites_: string[];
    petit_prix: string[];
    haut_de_gamme: string[];
    prestige: string[];
  };
  onAddToCart: (productId: number, quantity: number, variationId: number) => void;
}

const ProductsCards: React.FC<ProductsCardsProps> = ({ selectedFilters, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [sortBy, setSortBy] = useState<string>('');
  const productsRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error("La réponse de l'API n'est pas un tableau", response.data);
          setError('Erreur lors de la récupération des produits. Veuillez réessayer.');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des produits', err);
        setError('Erreur lors de la récupération des produits. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = useCallback(
    (product: Product) => {
      const isColorMatch = selectedFilters.color.length === 0 ||
        selectedFilters.color.some((selectedColor) =>
          product.categories?.some((category) =>
            category.name?.toLowerCase().trim() === selectedColor.toLowerCase().trim()
          )
        );

      const isMillesimeMatch = selectedFilters.millesime.length === 0 ||
        selectedFilters.millesime.includes(product.millesime || '');

      const isRegionMatch = selectedFilters.region.length === 0 ||
        selectedFilters.region.some(
          (region) =>
            region.toLowerCase().trim() === (product.region__pays || '').toLowerCase().trim()
        );

      const isCertificationMatch = selectedFilters.certification.length === 0 ||
        selectedFilters.certification.some(
          (certification) =>
            certification.toLowerCase().trim() === (product.certification || '').toLowerCase().trim()
        );

      const isStyleMatch = selectedFilters.style.length === 0 ||
        selectedFilters.style.some(
          (style) => style.toLowerCase().trim() === (product.style || '').toLowerCase().trim()
        );

      const isVolumeMatch = selectedFilters.volume.length === 0 ||
        selectedFilters.volume.some(
          (volume) => volume.toLowerCase().trim() === (product.volume || '').toLowerCase().trim()
        );

      const isAccordMetsMatch = selectedFilters.accord_mets.length === 0 ||
        selectedFilters.accord_mets.some((accordMets) =>
          (product.accord_mets ?? []).some(
            (met) => met.toLowerCase().trim() === accordMets.toLowerCase().trim()
          )
        );

      const isSansSulfitesMatch = selectedFilters.sans_sulfites_.length === 0 ||
        selectedFilters.sans_sulfites_.some(
          (sansSulfites) =>
          (sansSulfites.toLowerCase().trim() === 'sans sulfites ajoutés' && product.sans_sulfites_.toLowerCase().trim() === 'oui') ||
          sansSulfites.toLowerCase().trim() === (product.sans_sulfites_ || '').toLowerCase().trim()
        );

      const isPetitPrixMatch = (selectedFilters.petit_prix?.length ?? 0) === 0 ||
        selectedFilters.petit_prix?.some(
          (petitPrix) =>
          petitPrix.toLowerCase().trim() === 'petit_prix' &&
          (product.price <= 8 || (product.sale_price && product.sale_price <= 9.99))
      );

      const isHGPrixMatch = (selectedFilters.haut_de_gamme?.length ?? 0) === 0 ||
        selectedFilters.haut_de_gamme?.some(
          (hautDeGamme) =>
        hautDeGamme.toLowerCase().trim() === 'haut_de_gamme' &&
        ((product.price >= 11 && product.price <= 20) ||
         (product.sale_price && product.sale_price >= 11 && product.sale_price <= 20))
        );


        const isPrestigePrixMatch = (selectedFilters.prestige?.length ?? 0) === 0 ||
          selectedFilters.prestige?.some(
            (prestige) =>
              prestige.toLowerCase().trim() === 'prestige' &&
              product.volume === '75 cl' &&
              !(['carton', 'lot', 'caisse'].some(term => product.name.toLowerCase().includes(term))) &&
              ((product.price >= 20) ||
              (product.sale_price && product.sale_price >= 20))
          );


      return (
        isColorMatch &&
        isMillesimeMatch &&
        isRegionMatch &&
        isCertificationMatch &&
        isStyleMatch &&
        isVolumeMatch &&
        isAccordMetsMatch &&
        isSansSulfitesMatch &&
        isPetitPrixMatch &&
        isHGPrixMatch &&
        isPrestigePrixMatch
      );
    },
    [selectedFilters]
  );

  const sortProducts = (products: Product[], sortBy: string) => {
    switch (sortBy) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'date-added':
        return [...products].sort(
          (a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
        );
      default:
        return products;
    }
  };

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(filterProducts);
    return sortProducts(filtered, sortBy);
  }, [products, filterProducts, sortBy]);

  const loadMoreProducts = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const resetFilters = () => {
    setSortBy('');
    setVisibleCount(24);
  };

  useEffect(() => {
    // N'exécuter le défilement qu'après le premier chargement et lorsque les filtres sont modifiés
    let isMounted = true;

    if (isMounted && !initialLoad && Object.values(selectedFilters).some(filter => filter.length > 0)) {
      requestAnimationFrame(() => {
        if (productsRef.current) {
          console.log('Défilement vers le produit');
          productsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      setInitialLoad(false); // Une seule fois, après le premier chargement
    }

    return () => {
      isMounted = false;
    };
  }, [selectedFilters, initialLoad]);

  return (
    <div ref={productsRef} className="flex-1 px-4 lg:px-8">
      <br />
      <Filtertop sortBy={sortBy} handleSortChange={handleSortChange} resetFilters={resetFilters} />
      <br />
      <br />
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
            <p className="font-semibold">Chargement des vins...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-600 p-4 text-center">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center p-4">Aucun produit trouvé.</div>
      ) : (
        <div className="space-y-10 ">
          <div className="mx-auto overflow-hidden justify-center flex">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-center">
                {(() => {
                  const currentTime = Date.now();
                  let sortedProducts = [...filteredProducts];

                  if (!sortBy) {
                  // Only apply random sorting when no specific sort is selected
                  const lastSortTime = parseInt(sessionStorage.getItem('lastSortTime') || '0');
                  if (currentTime - lastSortTime > 600000) { // 10 minutes
                    sortedProducts = sortedProducts.sort(() => Math.random() - 0.7);
                    sessionStorage.setItem('lastSortTime', currentTime.toString());
                  } else {
                    // Use the stored order from session storage or keep current order
                    const storedOrder = JSON.parse(sessionStorage.getItem('productsOrder') || '[]');
                    if (storedOrder.length > 0) {
                    sortedProducts.sort((a, b) =>
                      storedOrder.indexOf(a.id) - storedOrder.indexOf(b.id)
                    );
                    }
                  }
                  }

                  // Store the current order
                  sessionStorage.setItem('productsOrder', JSON.stringify(sortedProducts.map(p => p.id)));

                  return sortedProducts
                  .slice(0, visibleCount)
                  .map((product) => (
                    <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={async () => await onAddToCart(product.id, 1, 0)}
                    />
                  ));
                })()}
            </div>
          </div>
          {filteredProducts.length > visibleCount && (
            <div className="flex justify-center py-6 !-mt-4">
              <button
                onClick={loadMoreProducts}
                className="bg-gray-950 text-white py-2 px-6 rounded-full hover:text-primary transition-colors duration-200"
              >
                Voir Plus de Vins
              </button>
            </div>
          )}
        </div>
      )}
    </div>

  );
};

export default ProductsCards;
