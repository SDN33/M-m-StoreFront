import Image from 'next/image';
import { useState } from 'react';

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

const ProductImage: React.FC<ProductImageProps> = ({
  product,
  renderAOCBadge,
  renderCertification,
  renderSelectedBadge,
  handleRedirect
}) => {
  const [imageSrc, setImageSrc] = useState(
    product.images[0]?.src || '/images/vinmeme.png'
  );

  const handleImageError = () => {
    setImageSrc('/images/vinmeme.png');
  };

  return (
    <div className="relative w-full h-52 mb-2 mt-2">
      {renderSelectedBadge()}

      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAMYAAAAAAIAAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUMAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMCEcGBgeMCMlJSAjJzA0MDE0MjdJOTArRkVDODhHKDdDRUFUTlVXWWZwbzTkda1//v/bAEMBFRcXGhobMR0dMThFMUVFRUVERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERET/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgMBAQAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          className="hover:scale-105 transition-transform cursor-pointer object-contain"
          onClick={handleRedirect}
          onError={handleImageError}
        />
      </div>

      {renderAOCBadge()}

      <div className={`absolute bottom-2 ${product.certification?.toLowerCase() === 'biodynamie' ? 'right-6' : 'right-0'} w-8 h-8 z-20`}>
        {renderCertification()}
      </div>
    </div>
  );
};

export default ProductImage;
