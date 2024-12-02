import { motion } from 'framer-motion';
import { Github, Linkedin, MessageCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const Footer = () => {
const {isDarkTheme} = useTheme()
  return (
    <footer className={`py-12 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6"
          >
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <span className={`text-xl font-bold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              ChatApp
            </span>
          </motion.div>

          <div className="flex items-center gap-6 mb-8">
            <motion.a
              href="https://github.com/prash766"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full ${
                isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
            >
              <Github className={`w-6 h-6 ${
                isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`} />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/prashant"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full ${
                isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
            >
              <Linkedin className={`w-6 h-6 ${
                isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`} />
            </motion.a>
          </div>

          <p className={`text-sm ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Made with ❤️ by Prashant
          </p>
        </div>
      </div>
    </footer>
  );
};