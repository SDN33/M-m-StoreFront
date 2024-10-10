import React, { useState } from 'react';
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
    title: 'Château La Rose du Pin',
    description: 'Un vin rouge fruité et équilibré, idéal pour accompagner vos plats de viande.',
    price: 12.5,
    imageUrl: '/images/vin.webp',
    supplier: 'Château La Rose',
    vintage: '2019',
    color: 'Rouge',
    region: 'Bordeaux',
    rating: 4.5,
    certification: 'Bio',
    dateAdded: new Date('2021-09-01'),
  },
  {
    id: 2,
    title: 'Domaine de la Vallée',
    description: 'Un vin blanc sec et minéral, parfait pour vos apéritifs et poissons.',
    price: 9.75,
    imageUrl: '/images/vin.webp',
    supplier: 'Domaine de la Vallée',
    vintage: '2020',
    color: 'Blanc',
    region: 'Loire',
    rating: 4.2,
    certification: 'Bio',
    dateAdded: new Date('2021-09-05'),
  },
  {
    id: 3,
    title: 'Château de la Rivière',
    description: 'Un vin rosé frais et fruité, à déguster en terrasse ou en bord de mer.',
    price: 8.99,
    imageUrl: '/images/vin.webp',
    supplier: 'Château de la Rivière',
    vintage: '2021',
    color: 'Rosé',
    region: 'Provence',
    rating: 4.8,
    certification: 'Bio',
    dateAdded: new Date('2021-09-10'),
  },
  {
    id: 4,
    title: 'Domaine de la Montagne',
    description: 'Un vin rouge corsé et épicé, pour les amateurs de vins puissants.',
    price: 15.25,
    imageUrl: '/images/vin.webp',
    supplier: 'Domaine de la Montagne',
    vintage: '2018',
    color: 'Rouge',
    region: 'Côtes du Rhône',
    rating: 3.6,
    certification: 'Demeter',
    dateAdded: new Date('2021-09-15'),
  },
  {
    id: 5,
    title: 'Château de la Vallée',
    description: 'Un vin blanc sec et minéral, parfait pour vos apéritifs et poissons.',
    price: 9.75,
    imageUrl: '/images/vin.webp',
    supplier: 'Domaine de la Vallée',
    vintage: '2020',
    color: 'Blanc',
    region: 'Loire',
    rating: 3.2,
    certification: 'Bio',
    dateAdded: new Date('2021-09-05'),
  },
  {
    id: 6,
    title: 'Château La Rose du Pin',
    description: 'Un vin rouge fruité et équilibré, idéal pour accompagner vos plats de viande.',
    price: 12.5,
    imageUrl: '/images/vin.webp',
    supplier: 'Château La Rose',
    vintage: '2019',
    color: 'Rouge',
    region: 'Bordeaux',
    rating: 2.5,
    certification: 'Bio',
    dateAdded: new Date('2021-09-08'),
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

    const sortedProducts = [...products]; // Utiliser 'const' ici

    if (value === 'price-asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (value === 'price-desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (value === 'rating') {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    } else if (value === 'date-added') {
      sortedProducts.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
    }

    setProducts(sortedProducts); // Mettre à jour l'état des produits triés
  };

  // Gestion des filtres de case à cocher
  const handleCheckboxChange = (filterType: keyof typeof selectedFilters, value: string) => {
    const currentFilters = selectedFilters[filterType] || []; // Assurez-vous que currentFilters est toujours un tableau

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
    <div className="flex flex-col md:flex-row">
      {/* Afficher le filtre sur mobile */}
      <div className="block md:hidden mb-4">
        <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleCheckboxChange} />
      </div>

      {/* Masquer le filtre sur mobile */}
      <div className="hidden md:block">
        <ProductFilter selectedFilters={selectedFilters} onFilterChange={handleCheckboxChange} />
      </div>

      {/* Contenu principal - cartes des produits */}
      <div className="flex-grow">
        {/* Onglet de tri pour version mobile */}
        <div className="flex flex-col items-center mb-4 sm:flex-row sm:justify-center md:justify-end mr-4">
          <label className="mr-6 font-bold text-gray-600">+ de 120 vignerons</label>
          <span className="mr-6 font-bold text-orange-500">|</span>
          <label className="mr-6 font-bold text-gray-600">+ de 1000 vins</label>
          <span className="mr-6 font-bold text-orange-500">|</span>
        
          {/* Label pour accessibilité */}
          <label htmlFor="sortBySelect" className="mr-6 font-bold text-gray-600">Trier par :</label>
        
          {/* Sélecteur avec id lié au label */}
          <select
            id="sortBySelect"
            value={sortBy}
            onChange={handleSortChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Choisir une option</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Note</option>
            <option value="date-added">Date d&apos;ajout</option>
          </select>
        </div>
        

        {/* Affichage des produits filtrés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            return (
              <div key={product.id} className="relative bg-white rounded-lg shadow-md overflow-hidden productcard">
                {product.certification && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                    {product.certification}
                  </span>
                )}
                <img src={product.imageUrl} alt={product.title} className="w-20 h-auto object-fill flex items-center justify-center mx-auto my-4" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                  <p className="text-sm text-gray-500 mt-2">{product.supplier}</p>
                  <p className="text-gray-600">{product.vintage}</p>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-lg">{product.price.toFixed(2)} €</span>
                    <span className="text-yellow-500">{'⭐'.repeat(Math.round(product.rating))}</span>
                  </div>
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
