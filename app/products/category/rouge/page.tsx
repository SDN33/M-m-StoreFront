'use client';
import RougeProductsCards from '@/components/RougeProductsCards';
import ProductIntro from '@/components/ProductIntro';
const RougePage = () => {

  return (
    <div className='text-center relative px-16'>
      <br /><br /><br />
      <br /><br />
      <ProductIntro />
      <RougeProductsCards />
      <br /><br />
    </div>
  );
};

export default RougePage;
