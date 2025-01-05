import { motion } from "framer-motion";
import { MessageSquare, Users, Bell, Moon, Sun, UserPlus2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import UserCard from "./UserCard";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/useStore";
import { toast } from "sonner";
import { ChatSkeleton } from "./ChatSideBarSkeleton";
import { NotificationModal } from "./modals/NotificationModal";
import { UserListModal } from "./modals/UserListModal/UserListModal";
import { useSocket } from "@/contexts/SocketContext";
import { Events } from "@/constants/events";
import useFriendStore from "@/store/useFriendStore";

export const ChatSidebar = () => {
  const { isDarkTheme } = useTheme();
  const socket = useSocket();
  const {onlineUsers, setIsUserTyping } = useChatStore()
  const [isUserSideBarFetched , setIsUserSidebarFetched] = useState<boolean>(false)
  const {
    getUsers,
    getUserSideBar,
    setUserSidebar,
    isUsersSidebarLoading,
    users,
    userSidebar,
  } = useChatStore();
  const { notificationCount, setNotificationCount } = useFriendStore();
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationCountRef = useRef<Number | null>(null);

  const mockNotifications = [
    {
      id: "1",
      type: "friend_accepted",
      content: "Amit accepted your friend request",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      sender: {
        name: "Amit",
        profilePic:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    },
    {
      id: "2",
      type: "message",
      content: "You have 2 new messages",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      sender: {
        name: "System",
        profilePic:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    },
  ];

  const mockPendingRequests = [
    {
      id: "1",
      sender: {
        name: "John Doe",
        profilePic:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    },
  ];



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUserSideBar();
        setIsUserSidebarFetched(true)
       
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleTyping = (data: {
      type: string;
      payload: {
        senderId: string;
        receiverId: string;
        isTyping: boolean;
      };
    }) => {
      console.log("Typing event received:", data);
      console.log("is typing", data.payload.isTyping);
      setIsUserTyping(data.payload);
    };

    socket?.on("typing", handleTyping);

    return () => {
      socket?.off("typing", handleTyping);
    };
  }, [socket]);

  useEffect(()=>{
    if(!isUserSideBarFetched) return 
    console.log("use effect chat sidebar ")
    socket?.on(Events.FRIEND_REQUEST_SENT, (data) => {
      console.log("frined request sent data",data);
      setNotificationCount(notificationCount + 1);
    });
    socket?.on(Events.FRIEND_REQUEST_ACCEPTED , (data)=>{
      console.log("thsi si the frined request accepted event",data)
      const updatedfriends = userSidebar.friends
      console.log( "updated Frieds" , updatedfriends)
      const addedFriend = {
        ...userSidebar,
        friends : [...updatedfriends, 
          data.payload.receiverInfo

        ]
      }
      console.log("sidebar users added new thru socket" , addedFriend)
      setUserSidebar(addedFriend)
    });
  }, [socket, notificationCount , userSidebar])

  function handleClick() {}

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
            <div className="relative">
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
              {notificationCount > 0 && (
                <div className="absolute top-2 right-1 flex items-center justify-center w-4 h-4 bg-red-700 text-white text-xs font-bold rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {notificationCount}
                </div>
              )}
            </div>
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
          {isUsersSidebarLoading
            ? [...Array(6)].map((_, index) => <ChatSkeleton key={index} />)
            : userSidebar.friends?.map((chat) => (
                <UserCard key={chat._id} chat={chat} />
              ))}
        </div>
      </motion.div>

      <UserListModal
        isOpen={isUserListOpen}
        onClose={() => setIsUserListOpen(false)}
        isDarkTheme={isDarkTheme}
        notificationCount={notificationCountRef}
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
