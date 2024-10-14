import ProductsIntro from './ProductIntro'; // Importer le composant ProductsIntro
import ProductsCards from './ProductsCards'; // Importer le composant ProductsCards


const Products: React.FC = () => {
  return (
    <div className="text-center relative px-14">
      <br />
      <br />
      <ProductsIntro />
      <div className="border-b-2 border-orange-600 w-full md:w-[70rem] my-2 md:my-4 slide-in-right"></div>
      <br />
      <ProductsCards />



    </div>
  );
};

export default Products;
