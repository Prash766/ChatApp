import { motion } from 'framer-motion';
import { LogOut, MessageCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSocket } from '@/contexts/SocketContext';

export const Navbar = () => {
  const {isDarkTheme , setTheme} = useTheme()
  const { authenticateUser, isAuthenticated, logOut} = useAuthStore()
  const navigate = useNavigate()
  const socket = useSocket()

  useEffect(()=>{
   authenticateUser()
  },[])  

 async function  handleLogoutClick(){
  const res = await logOut()
  if(res.status!==200){
    toast.error(`${res.data.message || "Logout Failed"}`)

  }

  navigate('/', {replace:true})
  socket?.disconnect()

  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 ${
        isDarkTheme ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-sm border-b ${
        isDarkTheme ? 'border-gray-800' : 'border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
onClick={()=>navigate('/')}
              className="cursor-pointer flex items-center gap-2"
            >
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <span className={`text-xl font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>
                ChatApp
              </span>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={setTheme}
              className={`p-2 rounded-full ${
                isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {isDarkTheme ? (
                <Sun className="w-5 h-5 text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>
            {isAuthenticated ? (
              <>
              <motion.button
              onClick={()=> navigate('/chat')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                Open Chat
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick= {handleLogoutClick}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
               <div className='flex'>
               <LogOut/> <span className='ml-2'>Logout</span>
                </div> 
              </motion.button>
                </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={()=> navigate('/login')}
                  className={`px-4 py-2 rounded-full ${
                    isDarkTheme
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={()=>navigate('/signup')}
                  className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};