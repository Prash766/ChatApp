import { motion } from 'framer-motion';

export const ChatSkeleton = () => {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      
      </div>
    </div>
  );
};

export const ChatSideBarSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ChatSkeleton />
        </motion.div>
      ))}
    </>
  );
};