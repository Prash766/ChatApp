import { motion } from "framer-motion";

export const MessageSkeleton = () => {
  return (
    <div className="flex items-end gap-2 mb-4 mt-4">
      <div className="w-8 h-8 ml-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="flex flex-col gap-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[90%] rounded-lg p-3 bg-gray-200 dark:bg-gray-700"
        >
          <div className="w-24 h-4 -ml-1 mr-2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className=" h-3 mt-2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

export const MessagesSkeleton = () => {
  return (
    <div className="space-y-9">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={`flex ${index % 2 === 0 ? "" : "justify-end"}`}
        >
          {index % 2 === 0 ? (
            <MessageSkeleton />
          ) : (
            <div className="flex items-end gap-2 mb-4">
              <div className="flex flex-col gap-1 items-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-[90%]  rounded-lg p-3 bg-blue-100 dark:bg-blue-900"
                >
                  <div className="w-24 h-4 mr-2  bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                  <div className=" h-3 mt-2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                </motion.div>
                <div className=" h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2" />
              </div>
              <div className="w-8 h-8 mr-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
