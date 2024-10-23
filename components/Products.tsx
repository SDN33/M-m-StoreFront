import React from 'react';
import ProductsIntro from './ProductIntro'; // Importer le composant ProductsIntro
import ProductsCards from './ProductsCards'; // Importer le composant ProductsCards

const Products: React.FC = () => {
  return (
    <div id="products" className="text-center relative px-16">
      <br />
      <ProductsCards /> {/* Pas de props nécessaires ici */}
      <br />
      <br />
    </div>
  );
};

export default Products;
