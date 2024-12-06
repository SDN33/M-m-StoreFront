import Image from 'next/image';
import { useState, useCallback, useMemo } from 'react';

interface ProductImageProps {
  product: {
    images: { src: string }[];
    name: string;
    certification?: string;
  };
  renderAOCBadge: () => React.ReactNode;
  renderCertification: () => React.ReactNode;
  renderSelectedBadge: () => React.ReactNode;
  handleRedirect: () => void;
}

const FALLBACK_IMAGE = '/images/vinmeme.png';

const ProductImage: React.FC<ProductImageProps> = ({
  product,
  renderAOCBadge,
  renderCertification,
  renderSelectedBadge,
  handleRedirect
}) => {
  // Memoize the initial image source to prevent unnecessary re-renders
  const initialImageSrc = useMemo(() =>
    product.images[0]?.src || FALLBACK_IMAGE,
    [product.images]
  );

  const [imageSrc, setImageSrc] = useState(initialImageSrc);

  // Optimize error handling with useCallback
  const handleImageError = useCallback(() => {
    setImageSrc(FALLBACK_IMAGE);
  }, []);

  // Memoize certification positioning
  const certificationPosition = useMemo(() =>
    `absolute bottom-2 ${product.certification?.toLowerCase() === 'biodynamie' ? 'right-6' : 'right-0'} w-8 h-8 z-20`,
    [product.certification]
  );

  return (
    <div className="relative w-full h-52 mb-2 mt-2 flex items-center justify-center">
      {renderSelectedBadge()}

      <div className="relative w-full h-full max-w-full max-h-full">
        <Image
          src={imageSrc}
          alt={product.name}
          width={200}
          height={200}
          sizes="(max-width: 768px) 200px, 250px"
          unoptimized={imageSrc === FALLBACK_IMAGE}
          quality={imageSrc === FALLBACK_IMAGE ? 50 : 80}
          priority={imageSrc !== FALLBACK_IMAGE}
          className="hover:scale-105 transition-transform cursor-pointer object-cover rounded-lg flex justify-center mx-auto"
          onClick={handleRedirect}
          onError={handleImageError}
        />
      </div>

      {renderAOCBadge()}

      <div className={certificationPosition}>
        {renderCertification()}
      </div>
    </div>
  );
};

export default ProductImage;
