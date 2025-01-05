import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import useFriendStore, { PendingFriend } from "@/store/useFriendStore";
import { useChatStore } from "@/store/useStore";
import { FriendsType } from "@/store/useAuthStore";
import { useSocket } from "@/contexts/SocketContext";
import { Events } from "@/constants/events";

interface Notification {
  id: string;
  type: "friend_request" | "friend_accepted" | "message";
  content: string;
  timestamp: Date;
  sender: {
    name: string;
    profilePic: string;
  };
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  notifications: Notification[];
  noitficationCount : number
  pendingRequests: any[];
}

export const NotificationModal = ({
  isOpen,
  onClose,
  isDarkTheme,
  notifications,
  pendingRequests,
}: NotificationModalProps) => {
  const {getPendingFriendList , pendingFriendList, acceptFriendRequest , rejectFriendRequest, setPendingList, notificationCount , setNotificationCount}= useFriendStore()
  const userId = localStorage.getItem("userId")
  const socket = useSocket()
  const {userSidebar , setUserSidebar} = useChatStore()

  const handleAcceptRequest = async(request  : PendingFriend) => {
    const res = await acceptFriendRequest(request._id , request.senderId)
    const friends  = userSidebar.friends
    const acceptedUser = {
      ...userSidebar,
      friends : [...friends , request.senderInfo]
    }
    setUserSidebar(acceptedUser)

    const pendingList = pendingFriendList.filter(list=> list._id !== request._id)
    // const msg= {
    //   senderId : request.senderId,
    //   receiverId : request.receiverId,
    //   payload:{
    //     senderInfo :  request.senderInfo,
    //     receiverInfo : request.receiverInfo
    //   }
    // }
    // socket?.emit(Events.FRIEND_REQUEST_ACCEPTED ,msg)

    setPendingList(pendingList)  
    setNotificationCount(notificationCount-1)
      
  };

  const handleRejectRequest = async(request :PendingFriend) => {
    const res = await rejectFriendRequest(request.senderId , request._id)
    const pendingList = pendingFriendList.filter(list=> list._id !== request._id)
    setPendingList(pendingList)
    setNotificationCount(notificationCount-1)
    console.log(res)

    console.log("Reject request:", request.senderId);
  };
  const filteredList = pendingFriendList.filter(list=> list.receiverId === userId && list.cooldown === null)

  useEffect(()=>{
  async  function fetchPendingList(){
   await getPendingFriendList()
    }
    fetchPendingList()

  },[])

  useEffect(()=>{
socket?.on(Events.FRIEND_REQUEST_SENT , (data)=>{
  console.log("data fromt eh backend for requet sent" , data)
  const obj = {
    _id: data.payload.friendRequest._id,
    receiverId : data.payload.friendRequest.receiverId,
    senderId : data.payload.friendRequest.senderId,
    senderInfo : data.payload.senderInfo,
    receiverInfo : data.payload.receiverInfo,
    status : data.payload.friendRequest.status
  }
  const updatedFriendList = [...pendingFriendList , obj] as PendingFriend[]
  setPendingList(updatedFriendList)
})
  },[socket, pendingFriendList , notificationCount ])



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-md rounded-lg shadow-xl ${
              isDarkTheme ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
                  Notifications
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full hover:bg-opacity-10 ${
                    isDarkTheme ? "hover:bg-white" : "hover:bg-gray-800"
                  }`}
                >
                  <X className={isDarkTheme ? "text-white" : "text-gray-800"} />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Pending Requests Section */}
              <div className="p-4">
                <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
                  Pending Requests
                </h3>
                {filteredList.length === 0 ? (
                  <p className={`text-center py-4 ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
                    No pending requests
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredList.map(request => (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${isDarkTheme ? "bg-gray-700" : "bg-gray-50"}`}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={request.senderInfo.profilePic}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
                              {request.senderInfo.fullName}
                            </p>
                            <p className={`text-sm ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
                              Sent you a friend request
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptRequest(request)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest( request)}
                              className="px-3 py-1 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications Section */}
              <div className="p-4 max-h-[40vh] overflow-y-auto">
                <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${isDarkTheme ? "bg-gray-700" : "bg-gray-50"}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          notification.type === "friend_accepted" ? "bg-green-500" : "bg-blue-500"
                        }`}>
                          {notification.type === "friend_accepted" ? (
                            <UserCheck className="text-white" size={20} />
                          ) : (
                            <MessageSquare className="text-white" size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
                            {notification.content}
                          </p>
                          <p className={`text-sm ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
                            {format(notification.timestamp, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};