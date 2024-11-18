type Vendor = {
  id: number;
  name: string;
  display_name: string;
  description: string;
  social: Record<string, string>;
  shop: {
    picture: string;
    banner: string;
  };
  address: {
    city: string;
    postcode: string;
  };
};

// Cache local pour les vendeurs
let vendorsCache: Vendor[] | null = null;

/**
 * Récupère les vendeurs, avec mise en cache.
 * @param fetchVendors Une fonction pour récupérer les vendeurs depuis l'API.
 */
export const getVendors = async (fetchVendors: () => Promise<Vendor[]>): Promise<Vendor[]> => {
  if (!vendorsCache) {
    console.log("Fetching vendors from API...");
    vendorsCache = await fetchVendors();
  } else {
    console.log("Using cached vendors...");
  }
  return vendorsCache;
};

/**
 * Trouve un vendeur par son ID.
 * @param id L'ID du vendeur à rechercher.
 */
export const getVendorById = (id: number): Vendor | null => {
  if (!vendorsCache) {
    console.warn("Vendors cache is empty. Fetch vendors first.");
    return null;
  }
  return vendorsCache.find((vendor) => vendor.id === id) || null;
};
