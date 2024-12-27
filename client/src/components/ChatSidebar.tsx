import { motion } from "framer-motion";
import { MessageSquare, Users, Bell, Moon, Sun, UserPlus2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import UserCard from "./UserCard";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useStore";
import { toast } from "sonner";
import { ChatSkeleton } from "./ChatSideBarSkeleton";
import { NotificationModal } from "./modals/NotificationModal";
import { UserListModal } from "./modals/UserListModal/UserListModal";

export const ChatSidebar = () => {
  const { isDarkTheme } = useTheme();
  const { getUsers,getUserSideBar, isUsersSidebarLoading, users ,userSidebar } = useChatStore();
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const mockNotifications = [
    {
      id: "1",
      type: "friend_accepted",
      content: "Amit accepted your friend request",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      sender: {
        name: "Amit",
        profilePic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    },
    {
      id: "2",
      type: "message",
      content: "You have 2 new messages",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      sender: {
        name: "System",
        profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    }
  ];

  const mockPendingRequests = [
    {
      id: "1",
      sender: {
        name: "John Doe",
        profilePic: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUserSideBar()
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetchUsers();
  }, []);

 function  handleClick(){}

  return (
    <>
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
              onClick={() => setIsUserListOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              <UserPlus2 className={isDarkTheme ? "text-white" : ""} />
            </button>
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
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
        { isUsersSidebarLoading
          ? [...Array(6)].map((_, index) => (
              <ChatSkeleton key={index} />
            ))
          : userSidebar.friends?.map((chat) => (
              <UserCard key={chat._id} chat={chat} />
            ))}
      </div>
    </motion.div>

    <UserListModal
        isOpen={isUserListOpen}
        onClose={() => setIsUserListOpen(false)}
        isDarkTheme={isDarkTheme}
        users={users || []}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        isDarkTheme={isDarkTheme}
        notifications={mockNotifications}
        pendingRequests={mockPendingRequests}
      />
    </>
  );
};
