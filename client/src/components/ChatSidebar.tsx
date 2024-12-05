import { motion } from 'framer-motion';
import { MessageSquare, Users, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ChatSidebar = () => {
const  {isDarkTheme , setTheme} = useTheme()
  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`w-80 h-screen border-r ${
        isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h1 className={`text-xl font-bold ${
          isDarkTheme ? 'text-white' : 'text-gray-800'
        }`}>
          Chats
        </h1>
        <div className="flex gap-2">
          <button onClick={setTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            {isDarkTheme ? <Sun className="text-white" /> : <Moon />}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className={isDarkTheme ? 'text-white' : ''} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
        <button className="flex-1 py-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
          <MessageSquare className="inline-block mr-2" size={18} />
          Chats
        </button>
        <button className="flex-1 py-2 px-4 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <Users className="inline-block mr-2" size={18} />
          Groups
        </button>
      </div>

      {/* <div className="overflow-y-auto h-[calc(100vh-140px)]">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 cursor-pointer border-b ${
              isDarkTheme 
                ? 'border-gray-700 hover:bg-gray-800' 
                : 'border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" 
                  className="w-12 h-12 rounded-full object-cover"
                  alt="User avatar"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {chat.users[0]}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {chat.lastMessage?.text}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div> */}
    </motion.div>
  );
};