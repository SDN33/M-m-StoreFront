import React from 'react';
import VendorSlider from './WineCategories';
import CatSlider from './CatSlider';

const DualSlider = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto px-4">
      <div>
        <VendorSlider/>
      </div>
      <div>
        <CatSlider />
      </div>
    </div>
  );
};

export default DualSlider;
