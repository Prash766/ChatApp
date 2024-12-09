import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ChatPagePlaceholder = () => {
  const { isDarkTheme } = useTheme();

  return (
    <div className={`min-h-screen flex md:ml-96 items-center justify-center px-4 sm:px-6 lg:px-8  ${
      isDarkTheme ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${
              isDarkTheme ? "#1e40af" : "#3b82f6"
            } 0%, transparent 50%)`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl text-center"
        >
          <motion.div 
            className="relative inline-block mb-8 "
            animate={{
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className={`p-6 rounded-full transition-colors duration-300 ${
              isDarkTheme ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}>
              <MessageSquare size={48} className="text-blue-500" />
            </div>
            <motion.div 
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
            >
              <Sparkles size={20} className="text-yellow-400" />
            </motion.div>
          </motion.div>

          <motion.h1 
            className={`text-4xl md:text-5xl  font-bold mb-6 transition-colors duration-300 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to ChatApp
          </motion.h1>

          <motion.p 
            className={`text-lg md:text-xl mb-12  transition-colors duration-300 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your modern space for seamless communication
          </motion.p>


          <motion.button
            className="px-8 py-3 md bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare size={20} />
            Start Chatting
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ChatPagePlaceholder;