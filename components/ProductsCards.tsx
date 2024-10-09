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
    imageUrl: '/app/assets/images/products/1.jpg',
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
    imageUrl: '/app/assets/images/products/2.jpg',
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
    imageUrl: '/app/assets/images/products/3.jpg',
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
    imageUrl: '/app/assets/images/products/4.jpg',
    supplier: 'Domaine de la Montagne',
    vintage: '2018',
    color: 'Rouge',
    region: 'Côtes du Rhône',
    rating: 4.6,
    certification: 'Demeter',
    dateAdded: new Date('2021-09-15'),
  },
  {
    id: 5,
    title: 'Château de la Vallée',
    description: 'Un vin blanc sec et minéral, parfait pour vos apéritifs et poissons.',
    price: 9.75,
    imageUrl: '/app/assets/images/products/2.jpg',
    supplier: 'Domaine de la Vallée',
    vintage: '2020',
    color: 'Blanc',
    region: 'Loire',
    rating: 4.2,
    certification: 'Bio',
    dateAdded: new Date('2021-09-05'),
  },
  {
    id: 6,
    title: 'Château La Rose du Pin',
    description: 'Un vin rouge fruité et équilibré, idéal pour accompagner vos plats de viande.',
    price: 12.5,
    imageUrl: '/app/assets/images/products/1.jpg',
    supplier: 'Château La Rose',
    vintage: '2019',
    color: 'Rouge',
    region: 'Bordeaux',
    rating: 4.5,
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
            <option value="date-added">Date d&apos;ajout</option>
          </select>
        </div>
        <br />

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
                <div className="relative">
                  <img
                    src={product.imageUrl || '/app/assets/images/noimage/large.png'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-gray-800 font-semibold mb-2">{product.price.toFixed(2)} €</p>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{product.region}</span>
                    <span className="text-gray-500">{product.vintage}</span>
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
