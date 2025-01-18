import { motion } from "framer-motion";
import { UserPlus, Check, Clock } from "lucide-react";
import { User } from "./UserListModal";
import useFriendStore from "@/store/useFriendStore";
import { toast } from "sonner";

interface UserCardProps {
  user: User;
  isDarkTheme: boolean;
}

export const UserCardModal = ({
  user,
  isDarkTheme,
}: UserCardProps) => {
  const { sendFriendRequest, setFriendRequestReceiver , friendRequestSentList , setFriendRequestSentList } = useFriendStore();
  const hasRequestSent = friendRequestSentList.has(user._id)

  async function handleFriendRequest() {
    if(hasRequestSent) return
    try {
      setFriendRequestReceiver(user._id);
      const res = await sendFriendRequest();
      if (res.status === 200) {
        toast.success("Friend request sent successfully!", {
          duration: 3000,
          className: isDarkTheme ? "dark-toast" : "",
        });
        setFriendRequestSentList(user._id)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const pendingRequest = user.hasPendingRequest?.find(
    (request) => request.receiverId === user._id && request.status === "PENDING"
  );

  const isInCooldown =
    pendingRequest?.cooldown &&
    new Date(pendingRequest.cooldown).getTime() > Date.now();

  const remainingCooldownTime = isInCooldown
    ? Math.ceil(
        (new Date(pendingRequest?.cooldown || "").getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-xl ${
        isDarkTheme
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-gray-50 hover:bg-gray-100"
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
          <h3
            className={`font-medium ${
              isDarkTheme ? "text-white" : "text-gray-800"
            }`}
          >
            {user.fullName}
          </h3>
          <p
            className={`text-sm ${
              isDarkTheme ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {user.email}
          </p>
        </div>
      </div>

      {isInCooldown ? (
        <div
          className="p-2.5 rounded-xl bg-yellow-500 text-white transform hover:scale-105 transition-all duration-300 relative group"
        >
          <Clock size={20} />
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Cooldown: {remainingCooldownTime} day(s)
          </span>
        </div>
      ) : pendingRequest||hasRequestSent ? (
        <div className="p-2.5 rounded-xl bg-green-500 text-white transform hover:scale-105 transition-all duration-300">
          <Check size={20} />
        </div>
      ) : ( 
        <button
          onClick={handleFriendRequest}
          className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-105"
        >
          <UserPlus size={20} />
        </button>
      )}
    </motion.div>
  );
};
