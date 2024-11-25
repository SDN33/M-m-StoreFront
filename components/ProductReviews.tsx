"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    yotpo: {
      initWidgets: () => void;
    };
  }
}

interface ProductReviewsProps {
  productId: string;
  productImages: string[];
  productPrice: string;
}

const ProductReviews = ({ productId, productImages, productPrice }: ProductReviewsProps) => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.yotpo) {
      window.yotpo.initWidgets();
    }
  }, []);

  return (
    <div>
      {/* Widget Yotpo Reviews */}
      <div
        className="yotpo yotpo-main-widget"
        data-product-id={productId}
        data-name={productId}
        data-url={`https://https://portalpro-memegeorgette.com/produit/${productId}`}
        data-image-url={productImages[0]}
        data-description={`Description of product ${productId}`}
        data-price={productPrice}
        data-currency="EUR"
      ></div>
    </div>
  );
};

export default ProductReviews;
