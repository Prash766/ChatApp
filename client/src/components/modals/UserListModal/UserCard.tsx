import { motion } from "framer-motion";
import { UserPlus, Check } from "lucide-react";

interface UserCardProps {
  user: {
    _id: string;
    fullName: string;
    email: string;
    profilePic: string;
  };
  isDarkTheme: boolean;
  isRequestSent: boolean;
  onSendRequest: (userId: string) => void;
}

export const UserCard = ({ user, isDarkTheme, isRequestSent, onSendRequest }: UserCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-xl ${
        isDarkTheme ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
      } flex items-center justify-between transition-colors duration-300`}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={user.profilePic}
            alt={user.fullName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-blue-500"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700" />
        </div>
        <div>
          <h3 className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
            {user.fullName}
          </h3>
          <p className={`text-sm ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
            {user.email}
          </p>
        </div>
      </div>
      
      {!isRequestSent ? (
        <button
          onClick={() => onSendRequest(user._id)}
          className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-105"
        >
          <UserPlus size={20} />
        </button>
      ) : (
        <div className="p-2.5 rounded-xl bg-green-500 text-white transform hover:scale-105 transition-all duration-300">
          <Check size={20} />
        </div>
      )}
    </motion.div>
  );
};