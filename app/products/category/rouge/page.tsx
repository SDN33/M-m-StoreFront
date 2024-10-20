// app/products/category/rouge/page.tsx
'use client';

import Filtertop from "@/components/Filtertop";
import ProductFilter from "@/components/ProductFilters";

const RougePage = () => {
  return (
    <div>
      <video
        src="/videos/minibanner.mp4"
        width={1920}
        height={400}
        autoPlay
        loop
        muted
        playsInline
        className="w-full"
      >
        Your browser does not support the video tag.
      </video>
      <h1 className="text-3xl font-bold mt-10">Nos Vins Rouges</h1>
      <Filtertop
        sortBy="defaultSort"
        handleSortChange={() => {}}
        resetFilters={() => {}}
      />
      <ProductFilter
        selectedFilters={{
          color: [],
          region: [],
          vintage: [],
          certification: [],
          style: [],
          volume: [],
          accord_mets: [],
          region__pays: [],
        }}
        onFilterChange={() => {}}
      />
    </div>
  );
};

export default RougePage;
