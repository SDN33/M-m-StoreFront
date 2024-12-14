import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NosVinsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  vinsSubCategories: { name: string; href: string; bgClass: string; description?: string; }[];
}

const NosVinsPopup: React.FC<NosVinsPopupProps> = ({
  isOpen,
  onClose,
  vinsSubCategories
}) => {
  // Backdrop animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Popup container animation variants
  const popupVariants = {
    hidden: {
      scale: 0.9,
      opacity: 0,
      y: 50
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  // List item animation variants
  const listItemVariants = {
    hidden: {
      opacity: 0,
      x: -50
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 300
      }
    }
  };

  // Trap focus and handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
          />

          {/* Popup Container */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            onClick={onClose} // Ajoutez cette ligne

          >
            <motion.div
              className="w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture du popup quand on clique sur le contenu
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-950 to-gray-950 p-6 text-center relative">
                <h2
                  id="popup-title"
                  className="text-3xl font-bold text-white p-5 rounded-t-xl drop-shadow-md"
                >
                  Nos Catégories de Vins
                </h2>

                {/* Close Button - Conservé dans le style original */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-950 z-50 bg-white/50 rounded-full p-2 transition-all hover:bg-white/80"
                  aria-label="Fermer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto bg-white">
                <motion.ul
                  className="grid md:grid-cols-2 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {vinsSubCategories.map((subCategory) => (
                    <motion.li
                      key={subCategory.href}
                      variants={listItemVariants}
                      whileHover="hover"
                    >
                      <motion.a
                        href={subCategory.href}
                        className={`block rounded-xl overflow-hidden shadow-lg ${subCategory.bgClass}`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="p-6 text-center">
                          <motion.span
                            className="block text-white text-xl font-semibold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {subCategory.name}
                          </motion.span>
                          {subCategory.description && (
                            <motion.p
                              className="text-white/80 mt-2 text-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {subCategory.description}
                            </motion.p>
                          )}
                        </div>
                      </motion.a>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.a
                  className='flex mx-auto justify-center text-gray-600 mt-8 text-xl overflow-hidden font-bold'
                  href='/vins-sans-sulfites'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  Vins Sans Sulfites Ajoutés
                </motion.a>
                <motion.a
                  className='flex mx-auto justify-center text-gray-600 mt-4 text-xl overflow-hidden font-bold'
                  href='/vins-du-monde'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  Vins du Monde
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NosVinsPopup;
