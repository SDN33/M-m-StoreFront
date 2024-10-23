import React from 'react';
import ProductsCards from './ProductsCards'; // Importer le composant ProductsCards

const Products: React.FC = () => {
  return (
    <div id="products" className="text-center relative px-16">
      <br />
      <ProductsCards
        selectedFilters={{
          color: [],
          region: [],
          vintage: [],
          certification: [],
          style: [],
          volume: [],
          accord_mets: [],
          region__pays: []
        }}
      /> 
      <br />
      <br />
    </div>
  );
};

export default Products;
