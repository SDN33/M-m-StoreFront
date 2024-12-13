export interface Product {
  id: number;
  name: string;
  price: number;
  regular_price: number;
  sale_price: number;
  stock_status: string;
  volume: string;
  region__pays?: string;
  appellation?: string;
  description?: string;
  short_description?: string;
  images: { src: string }[];
  rating?: number;
  average_rating?: number;
  rating_count?: number;
  vendor?: {
    id?: number;
    vendorPhotoUrl?: string;
  };
  conservation?: string;
  style?: string;
  store_name?: string;
  categories: { id: number; name: string }[];
  accord_mets?: string;
  cepages?: string;
  nom_chateau?: string;
  certification?: string;
  degre?: number;
  millesime?: string;
  degustation: string;
  sans_sulfites_?: string;
}


