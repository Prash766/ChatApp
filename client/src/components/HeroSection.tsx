import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/useAuthStore';

const HeroSection = () => {
  const { isDarkTheme } = useTheme(); 
  const { isAuthenticated } = useAuthStore(); 

  return (
    <div className={`min-h-[90vh] ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-5 text-left mb-12 lg:mb-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span
                className={`inline-flex items-center px-6 py-2 rounded-full text-base font-medium ${
                  isDarkTheme ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Shield className="w-5 h-5 mr-2" />
                Secure Messaging Platform
              </span>
            </motion.div>

            {/* Hero Title */}
            <h1
              className={`text-5xl sm:text-7xl font-bold mb-8 leading-tight ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}
            >
              Connect and Chat{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                Seamlessly
              </span>{' '}
              with Anyone
            </h1>
            <p
              className={`text-xl lg:text-2xl mb-10 ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Experience real-time messaging with end-to-end encryption, group chats, and file sharing. Stay connected with friends and colleagues like never before.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // onClick={() => !isAuthenticated && setShowAuth(true)}
              className="w-full sm:w-auto px-10 py-5 text-lg rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {isAuthenticated ? 'Open Chat' : 'Get Started'} <ArrowRight className="ml-2 w-6 h-6" />
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-7 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2rem] opacity-10 blur-3xl" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-8 rounded-[2rem] ${
                isDarkTheme ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
              } shadow-2xl`}
            >
              <img
                src="https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=2400&q=90"
                alt="Chat Interface"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className={`absolute -bottom-6 -right-6 p-6 rounded-2xl ${
                  isDarkTheme ? 'bg-gray-800' : 'bg-white'
                } shadow-2xl`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-green-500 rounded-full absolute -top-1 -right-1 border-2 border-white dark:border-gray-800" />
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=96&h=96"
                      alt="User"
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
                    />
                  </div>
                  <div>
                    <p
                      className={`text-lg font-medium ${
                        isDarkTheme ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      John Doe
                    </p>
                    <p
                      className={`text-base ${
                        isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Online
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export { HeroSection };
