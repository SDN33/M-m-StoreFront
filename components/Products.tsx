import React, { useState } from 'react';
import ProductsIntro from './ProductIntro'; // Importer le composant ProductsIntro
import ProductsCards from './ProductsCards'; // Importer le composant ProductsCards


const Products: React.FC = () => {
  return (
    <div className="text-center relative px-14">
      <br />
      <br />
      <ProductsIntro />
      <br />
      <br />
      <ProductsCards />



    </div>
  );
};

export default Products;
