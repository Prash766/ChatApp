import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface VideoPreviewProps {
  videos: { url: string; thumbnail?: string }[];
  onRemove: (index: number) => void;
  onPreview: (url: string) => void;
}

export const VideoPreview = ({ videos, onRemove, onPreview }: VideoPreviewProps) => {
  const { isDarkTheme } = useTheme();

  if (videos.length === 0) return null;

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {videos.map((video, index) => (
            <motion.div
              key={`${video.url}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div
                onClick={() => onPreview(video.url)}
                className="w-24 h-24 rounded-lg bg-gray-900 cursor-pointer relative overflow-hidden"
              >
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={`Video thumbnail ${index + 1}`}
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Play className="w-8 h-8 text-white opacity-80" />
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className={`absolute -top-2 -right-2 p-1 rounded-full 
                  ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} 
                  shadow-lg opacity-0 group-hover:opacity-100 transition-opacity`}
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