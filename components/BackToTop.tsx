"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollableParent = document.querySelector("main.flex-1");
    if (!scrollableParent) return;

    let timeoutId: NodeJS.Timeout | undefined;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollTop = scrollableParent.scrollTop;
        setIsVisible(scrollTop > 100);
      }, 50); // Ajuster le délai selon vos besoins
    };

    scrollableParent.addEventListener("scroll", handleScroll);
    handleScroll(); // Vérifier la position initiale

    return () => {
      scrollableParent.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    const scrollableParent = document.querySelector("main.flex-1");
    if (scrollableParent) {
      scrollableParent.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{
            scale: [1, 1.2, 1],
            rotate: [0, 20, -20, 0],
          }}
          onClick={scrollToTop}
          className="shadow-2xl fixed bottom-6 right-24 z-[49] flex h-12 w-12 items-center justify-center rounded-full bg-teal-800/80 text-white hover:bg-primary-600 lg:h-14 lg:w-14"
          aria-label="Retour en haut de page"
        >
          <ArrowUp className="h-6 w-6 lg:h-7 lg:w-7" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
