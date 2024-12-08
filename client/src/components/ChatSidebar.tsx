import { motion } from "framer-motion";
import { MessageSquare, Users, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const ChatSidebar = () => {
  const { isDarkTheme, setTheme } = useTheme();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`w-80 h-[calc(100vh-64px)] border-r mt-16 transition-colors duration-100 ${
        isDarkTheme ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`p-4 flex items-center justify-between border-b 
      ${
        isDarkTheme ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }
          transition-colors duration-100`}
      >
        <h1
          className={`text-xl font-bold transition-colors duration-100 ${
            isDarkTheme ? "text-white" : "text-gray-800"
          }`}
        >
          Chat
        </h1>
        <div className="flex gap-2">
          <button
            onClick={setTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
          >
            {isDarkTheme ? (
              <Sun className="text-white transition-colors duration-100" />
            ) : (
              <Moon className="transition-colors duration-100" />
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100">
            <Bell
              className={`${
                isDarkTheme ? "text-white" : ""
              } transition-colors duration-100`}
            />
          </button>
        </div>
      </div>

      <div
        className={`flex gap-2 p-4 border-b 
              ${
                isDarkTheme
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              }

          transition-colors duration-100`}
      >
        <button className="flex-1 py-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-100">
          <MessageSquare className="inline-block mr-2" size={18} />
          Chats
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-full  ${
            isDarkTheme ? "bg-gray-800" : "bg-gray-100"
          }  transition-all duration-100`}
        >
          <Users className="inline-block mr-2" size={18} />
          Groups
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-200px)] transition-colors duration-100">
        {/* Chat list will be rendered here */}
      </div>
    </motion.div>
  );
};
