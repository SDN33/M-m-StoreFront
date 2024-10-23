import React, { useState, useEffect } from 'react';
import { Facebook, Linkedin, Link, Mail } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const [showNotification, setShowNotification] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Découvrez ce produit : ${encodedUrl}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setShowNotification(true);
    });
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <div className="flex flex-col items-start space-y-4 relative">
      <h3 className="text-sm font-semibold text-gray-800">Partager ce produit</h3>
      <div className="flex space-x-4">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-orange-800">
          <Facebook size={24} />
        </a>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-orange-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-orange-800">
          <Linkedin size={24} />
        </a>
        <a href={shareLinks.email} className="text-primary hover:text-orange-800">
          <Mail size={24} />
        </a>
        <button onClick={copyToClipboard} className="text-primary hover:text-orange-800">
          <Link size={24} />
        </button>
      </div>
      {showNotification && (
        <div className="absolute bottom-0 left-0 right-0 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4 rounded shadow-md transition-opacity duration-300 ease-in-out">
          Lien copié dans le presse-papier !
        </div>
      )}
    </div>
  );
};

export default SocialShare;
