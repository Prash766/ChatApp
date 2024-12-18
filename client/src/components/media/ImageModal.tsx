import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface ImageModalProps {
  imageUrlArray: string[];
  selectedImage: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ imageUrlArray, selectedImage, isOpen, onClose }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImage);
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    setCurrentIndex(selectedImage);
  }, [selectedImage]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < imageUrlArray.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, currentIndex]);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-7xl w-full h-full flex items-center justify-center p-4"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`absolute left-4 p-2 rounded-full transition-all ${
              currentIndex === 0
                ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                : "bg-black/50 text-white hover:bg-black/70"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === imageUrlArray.length - 1}
            className={`absolute right-4 p-2 rounded-full transition-all ${
              currentIndex === imageUrlArray.length - 1
                ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                : "bg-black/50 text-white hover:bg-black/70"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            src={imageUrlArray[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-full object-contain rounded-lg"
          />

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
            {currentIndex + 1} / {imageUrlArray.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;