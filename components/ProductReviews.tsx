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
  productName?: string;
}

const ProductReviews = ({
  productId,
  productImages,
  productPrice,
  productName
}: ProductReviewsProps) => {
  useEffect(() => {
    // Assurez-vous que Yotpo est chargé et initialisez les widgets
    if (typeof window !== "undefined" && window.yotpo) {
      try {
        window.yotpo.initWidgets();
      } catch (error) {
        console.error("Error initializing Yotpo widgets:", error);
      }
    }
  }, [productId]);

  return (
    <div className="yotpo-reviews-container ">
      {/* Widget Yotpo Reviews */}
      <div
        className="yotpo yotpo-main-widget"
        data-product-id={productId}
        data-name={productName || productId}
        data-url={`https://portalpro-memegeorgette.com/produit/${productId}`}
        data-image-url={productImages[0] || ''}
        data-description={`Découvrez le vin ${productName || productId}`}
        data-price={productPrice}
        data-currency="EUR"
      ></div>
    </div>
  );
};

export default ProductReviews;
