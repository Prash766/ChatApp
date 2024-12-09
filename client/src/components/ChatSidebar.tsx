import { motion } from "framer-motion";
import { MessageSquare, Users, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import UserCard from "./UserCard";
import { useEffect } from "react";
import { useChatStore } from "@/store/useStore";
import { toast } from "sonner";
import { ChatSkeleton } from "./ChatSideBarSkeleton";

export const ChatSidebar = () => {
  const { isDarkTheme, setTheme } = useTheme();
  const { getUsers, isUsersLoading, users } = useChatStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUsers();
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`w-80 h-[calc(100vh-64px)] border-r mt-16 transition-colors duration-300 ${
        isDarkTheme
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h1
          className={`text-xl font-bold transition-colors duration-300 ${
            isDarkTheme ? "text-white" : "text-gray-800"
          }`}
        >
          Chats
        </h1>
        <div className="flex gap-2">
          <button
            onClick={setTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            {isDarkTheme ? (
              <Sun className="text-white transition-colors duration-300" />
            ) : (
              <Moon className="transition-colors duration-300" />
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
            <Bell
              className={`${
                isDarkTheme ? "text-white" : ""
              } transition-colors duration-300`}
            />
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <button className="flex-1 py-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300">
          <MessageSquare className="inline-block mr-2" size={18} />
          Chats
        </button>
        <button className="flex-1 py-2 px-4 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
          <Users className="inline-block mr-2" size={18} />
          Groups
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-200px)] transition-colors duration-300">
        {isUsersLoading
          ? [...Array(6)].map((_, index) => (
              <ChatSkeleton key={index} />
            ))
          : users?.map((chat) => (
              <UserCard key={chat._id} chat={chat} />
            ))}
      </div>
    </motion.div>
  );
};
