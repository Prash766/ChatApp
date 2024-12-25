import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, MessageSquare } from "lucide-react";
import { format } from "date-fns";

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
  pendingRequests: any[];
}

export const NotificationModal = ({
  isOpen,
  onClose,
  isDarkTheme,
  notifications,
  pendingRequests,
}: NotificationModalProps) => {
  const handleAcceptRequest = (requestId: string) => {
    console.log("Accept request:", requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log("Reject request:", requestId);
  };

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
                {pendingRequests.length === 0 ? (
                  <p className={`text-center py-4 ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}>
                    No pending requests
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map(request => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${isDarkTheme ? "bg-gray-700" : "bg-gray-50"}`}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={request.sender.profilePic}
                            alt={request.sender.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
                              {request.sender.name}
                            </p>
                            <p className={`text-sm ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
                              Sent you a friend request
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
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