// types.ts
import { useState } from 'react';
export interface Product {
  id: number;
  name: string;
  categories: { id: number; name: string }[];
  price: number;
  date_added: string;
  images: { src: string }[];
  millesime?: string;
  certification?: string;
  region__pays?: string;
  store_name?: string;
  volume: string;
  vendor?: {
    vendorPhotoUrl?: string;
  };
  appelation?: string;
  nom_chateau?: string;
  average_rating?: number;
  rating_count?: number;
  style?: string;
  cepages?: string[];
  accord_mets?: string[];
}


// ProductFilter Props
export interface ProductFilterProps {
  selectedFilters: {
    color: string[];
    region: string[];
    vintage: string[];
    certification: string[];
    style: string[];
    volume: string[];
    accord_mets: string[];
    region__pays: string[];
  };
  onFilterChange: (filterType: keyof ProductFilterProps['selectedFilters'], value: string[]) => void;
  hideColorFilter?: boolean;
}

const [selectedFilters, setSelectedFilters] = useState<{
  color: string[];
  region: string[];
  vintage: string[];
  certification: string[];
  accord_mets: string[];
  region__pays: string[];
  price: string[];
  volume: string[];
  style: string[];
}>({
  color: [],
  region: [],
  vintage: [],
  certification: [],
  accord_mets: [],
  region__pays: [],
  price: [],
  volume: [],
  style: [],
});

const [visibleCount, setVisibleCount] = useState<number>(12);
