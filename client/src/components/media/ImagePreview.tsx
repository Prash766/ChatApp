import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ImagePreviewProps {
  images: string[];
  onRemove: (index: number) => void;
  setSelectedImage: (index: number) => void;
}

export const ImagePreview = ({ images, onRemove, setSelectedImage }: ImagePreviewProps) => {
  const { isDarkTheme } = useTheme();
  
  if (images.length === 0) return null;

  const handleImageClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedImage(index);
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onRemove(index);
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={`${image}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group cursor-pointer"
              onClick={(e) => handleImageClick(e, index)}
            >
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg transition-transform hover:scale-105"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleRemove(e, index)}
                className={`absolute -top-2 -right-2 p-1 rounded-full 
                  ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} 
                  shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10`}
              >
                <X className="w-4 h-4 text-red-500" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};