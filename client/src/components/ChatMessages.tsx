import { useTheme } from "@/contexts/ThemeContext";
import { useChatStore } from "@/store/useStore";
import { motion } from "framer-motion";

const ChatMessages = () => {
  const { isDarkTheme } = useTheme();
  const {selectedUser} = useChatStore()
  return (
    <div
      className={`flex-1 overflow-y-auto p-4 transition-colors duration-300 ${
        isDarkTheme ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex items-end gap-2">
        <img
          src={`${selectedUser?.profilePic}`}
          className="w-8 h-8 rounded-full object-cover"
          alt="User avatar"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-[70%] rounded-lg p-3 transition-colors duration-300 ${
            isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <p>Hey! How's it going?</p>
          <span className="text-xs text-gray-500 mt-1 transition-colors duration-300">
            12:30 PM
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatMessages;
