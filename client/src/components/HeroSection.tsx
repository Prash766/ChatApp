import { motion } from 'framer-motion';
import {  Shield, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/useAuthStore';

const HeroSection = () => {
  const {isDarkTheme} = useTheme()
  const {isAuthenticated} = useAuthStore()

  return (
    <div className={`min-h-screen  ${ isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-6 text-left mb-12 lg:mb-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 mt-10"
            >
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${
                isDarkTheme ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                <Shield className="w-4 h-4 mr-2" />
                Secure Messaging Platform
              </span>
            </motion.div>
            
            <h1 className={`text-4xl sm:text-6xl font-bold mb-6 leading-tight ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              Connect and Chat{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                Seamlessly
              </span>{' '}
              with Anyone
            </h1>
            
            <p className={`text-xl mb-8 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Experience real-time messaging with end-to-end encryption, group chats, and file sharing. Stay connected with friends and colleagues like never before.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // onClick={() => !currentUser && setShowAuth(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {isAuthenticated ? 'Open Chat' : 'Get Started'} <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-10 blur-2xl" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-6 rounded-2xl ${
                isDarkTheme ? 'bg-gray-800' : 'bg-white'
              } shadow-xl`}
            >
              <img
                src="https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=2000&q=80"
                alt="Chat Interface"
                className="w-full h-auto rounded-xl shadow-lg"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className={`absolute -bottom-4 -right-4 p-4 rounded-2xl ${
                  isDarkTheme ? 'bg-gray-800' : 'bg-white'
                } shadow-xl`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full absolute -top-1 -right-1" />
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64"
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className={`font-medium ${
                      isDarkTheme ? 'text-white' : 'text-gray-900'
                    }`}>John Doe</p>
                    <p className={`text-sm ${
                      isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                    }`}>Online</p>
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