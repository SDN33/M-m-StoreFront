'use client';
import { useState, useEffect } from "react";

// Fonction pour récupérer les données du vendeur
const fetchVendorData = async (vendorId: string) => {
  const vendorRes = await fetch(`/api/get-vendors/${vendorId}`);
  const vendorData = await vendorRes.json();
  return vendorData;
};

interface Product {
  id: string;
  vendor: number;
  image: string;
  name: string;
  price: string;
  description: string;
  categories: string[];

}

interface Vendor {
  shop: {
    banner: string;
    image: string;
  };
  display_name: string;
  description: string;
  address: {
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    phone: string;
  };
}

const VendorPage = ({ vendorId }: { vendorId: string }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les informations du vendeur et les produits
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const vendorData = await fetchVendorData(vendorId);
        setVendor(vendorData);

        // Charger les produits à partir du cache local ou de l'API
        const cachedProducts = JSON.parse(localStorage.getItem("vendorProducts") || "[]");
        const filteredProducts = cachedProducts.filter((product: Product) => product.vendor === parseInt(vendorId));
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }

      setLoading(false);
    };

    loadData();
  }, [vendorId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!vendor) {
    return <div>Vendor not found</div>;
  }

  // Vérifier les données du vendeur avant de les utiliser
  const { shop, display_name, description, address } = vendor;
  const bannerUrl = shop?.banner || '/default-banner.jpg';
  const avatarUrl = shop?.image || '/default-avatar.jpg';
  const vendorAddress = `${address?.address_1 || ''} ${address?.address_2 || ''} ${address?.city || ''} ${address?.state || ''} ${address?.country || ''} ${address?.postcode || ''}`;

  return (
    <div>
      {/* Vérification si banner et image sont disponibles */}
      <div className="vendor-header mt-60" style={{ backgroundImage: `url(${bannerUrl})` }}>
        <img src={avatarUrl} alt={display_name} className="vendor-avatar" />
        <h1>{display_name}</h1>
        <p>{description || "Aucune description disponible"}</p>
        <p>{vendorAddress || "Adresse non renseignée"}</p>
      </div>

      {/* Liste des produits */}
      <div className="vendor-products">
        <h2>Vins du vendeur</h2>
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </div>
            ))
          ) : (
            <p>Aucun produit disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPage;
