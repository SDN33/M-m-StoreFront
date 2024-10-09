import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import ProductFilter from '@/components/ProductFilters';

// Définir le type pour un produit
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  supplier: string; // Nom du fournisseur
  vintage: string; // Millésime
  color: string; // Couleur du vin
  region: string; // Région du vin
  rating: number; // Note du produit
  certification: string; // Certification du vin
  dateAdded: Date; // Date d'ajout du produit
}

// Exemple de produits fictifs
const productsData: Product[] = [
  {
    id: 1,
    title: 'Vin Blanc Bio',
    description: "Un vin blanc frais et fruité, idéal pour l'été. À déguster en terrasse.",
    price: 15.99,
    imageUrl: '/path/to/image1.jpg',
    supplier: 'Château Lamartine',
    vintage: '2022',
    color: 'Blanc',
    region: 'Bordeaux',
    certification: 'Bio',
    rating: 4.5,
    dateAdded: new Date(2023, 9, 15),
  },
  {
    id: 2,
    title: 'Vin Rouge Bio',
    description: 'Un vin rouge riche et complexe, parfait avec un repas.',
    price: 20.99,
    imageUrl: '/path/to/image2.jpg',
    supplier: 'Château de la Rivière',
    vintage: '2021',
    color: 'Rouge',
    region: 'Côtes du Rhône',
    certification: 'Demeter',
    rating: 4.7,
    dateAdded: new Date(2023, 8, 1),
  },
  {
    id: 3,
    title: 'Vin Rosé Bio',
    description: "Un vin rosé léger et rafraîchissant, parfait pour l'apéro.",
    price: 12.99,
    imageUrl: '', // Exemple d'image manquante
    supplier: 'Château Maison Blanche',
    vintage: '2020',
    color: 'Rosé',
    region: 'Provence',
    certification: 'Bio',
    rating: 4.0,
    dateAdded: new Date(2022, 11, 22),
  },
  {
    id: 4,
    title: 'Vin Rouge Demeter',
    description: 'Un vin rouge corsé et épicé, idéal pour les amateurs de vin rouge.',
    price: 24.99,
    imageUrl: '/path/to/image4.jpg',
    supplier: 'Domaine de la Vallée',
    vintage: '2021',
    color: 'Rouge',
    region: 'Bordeaux',
    certification: 'Demeter',
    rating: 4.8,
    dateAdded: new Date(2023, 7, 5),
  },
  {
    id: 5,
    title: 'Vin Blanc Bio',
    description: 'Un vin blanc sec et minéral, parfait pour accompagner les fruits de mer.',
    price: 18.99,
    imageUrl: '/path/to/image5.jpg',
    supplier: 'Château de la Mer',
    vintage: '2022',
    color: 'Blanc',
    region: 'Provence',
    certification: 'Bio',
    rating: 4.2,
    dateAdded: new Date(2023, 6, 12),
  },
  {
    id: 6,
    title: 'Vin Rosé Bio',
    description: 'Un vin rosé fruité et gourmand, à déguster en terrasse.',
    price: 14.99,
    imageUrl: '/path/to/image6.jpg',
    supplier: 'Domaine de la Vallée',
    vintage: '2021',
    color: 'Rosé',
    region: 'Côtes du Rhône',
    certification: 'Bio',
    rating: 4.6,
    dateAdded: new Date(2023, 5, 28),
  },
];

const ProductsCards: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>(''); // État pour gérer le tri
  const [products, setProducts] = useState<Product[]>(productsData); // État pour les produits
  const [selectedFilters, setSelectedFilters] = useState({
    color: [] as string[],
    region: [] as string[],
    vintage: [] as string[],
    certification: [] as string[],
  });

  // Fonction de tri
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);

    let sortedProducts = [...products];

    if (value === 'price-asc') {
      sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
    } else if (value === 'price-desc') {
      sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
    } else if (value === 'rating') {
      sortedProducts = sortedProducts.sort((a, b) => b.rating - a.rating);
    } else if (value === 'date-added') {
      sortedProducts = sortedProducts.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
    }

    setProducts(sortedProducts); // Mettre à jour l'état des produits triés
  };

  // Gestion des filtres de case à cocher
  const handleCheckboxChange = (filterType: keyof typeof selectedFilters, value: string) => {
    const currentFilters = selectedFilters[filterType];

    // Ajouter ou retirer la valeur de la liste des filtres sélectionnés
    if (currentFilters.includes(value)) {
      setSelectedFilters({
        ...selectedFilters,
        [filterType]: currentFilters.filter((item) => item !== value),
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filterType]: [...currentFilters, value],
      });
    }
  };

  // Filtrer les produits en fonction des filtres sélectionnés
  const filteredProducts = products.filter((product) => {
    return (
      (selectedFilters.color.length === 0 || selectedFilters.color.includes(product.color)) &&
      (selectedFilters.region.length === 0 || selectedFilters.region.includes(product.region)) &&
      (selectedFilters.vintage.length === 0 || selectedFilters.vintage.includes(product.vintage)) &&
      (selectedFilters.certification.length === 0 || selectedFilters.certification.includes(product.certification))
    );
  });

  return (
    <div className="flex">
      <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleCheckboxChange} />
      {/* Contenu principal - cartes des produits */}
      <div className="flex-grow ml-4">
        {/* Onglet de tri en haut à droite */}
        <div className="flex justify-end mb-4 mr-[6rem]">
          <label className="mr-6 font-bold text-gray-600">+ de 120 vignerons</label>
          <label className="mr-6 font-bold text-orange-500">|</label>
          <label className="mr-6 font-bold text-gray-600">+ de 1000 vins</label>
          <label className="mr-6 font-bold text-orange-500">|</label>
          <label className="mr-6 font-bold text-gray-600">Trier par :</label>
          <select value={sortBy} onChange={handleSortChange} className="border rounded px-2 py-1">
            <option value="">Sélectionner</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Note</option>
            <option value="date-added">Date d'ajout</option>
          </select>
        </div>
        <br />

        {/* Affichage des produits filtrés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const newQuantity = Math.max(1, Number(e.target.value));
              // Logique pour gérer la quantité (si nécessaire)
            };

            return (
              <div key={product.id} className="relative bg-white rounded-lg shadow-md overflow-hidden productcard">
                {/* Ajouter un badge si le produit est bio */}
                {product.certification && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                    {product.certification}
                  </span>
                )}
                <div className="relative">
                  {/* Utiliser une image de placeholder si l'image du produit n'est pas disponible */}
                  <img
                    src={product.imageUrl || '/app/assets/images/noimage/large.png'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-gray-800 font-semibold mb-2">{product.price} €</p>
                  <p className="text-gray-500 text-sm mb-4">Millésime : {product.vintage}</p>
                  <p className="text-gray-500 text-sm mb-4">Région : {product.region}</p>
                  <p className="text-gray-500 text-sm mb-4">Note : {product.rating} ⭐</p>

                  {/* Sélecteur de quantité */}
                  <div className="flex items-center mb-4">
                    <label htmlFor={`quantity-${product.id}`} className="mr-2">Quantité :</label>
                    <input
                      type="number"
                      id={`quantity-${product.id}`}
                      value={1} // Valeur par défaut pour le champ quantité
                      onChange={handleQuantityChange}
                      min={1}
                      className="border px-2 py-1 rounded w-16"
                    />
                  </div>

                  {/* Ajouter au panier */}
                  <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-500">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsCards;
