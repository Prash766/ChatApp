import { motion, AnimatePresence } from "framer-motion";
import { Loader, X } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { SearchBar } from "./SearchBar";
import { UserCardModal } from "./UserCardModal";
import { useChatStore } from "@/store/useStore";
import { useSocket } from "@/contexts/SocketContext";
import { Events } from "@/constants/events";

export interface FriendRequest {
  _id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "REJECTED" | "ACCEPTED";
  cooldown: string | null;
  createdAt: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  // hasPendingRequest : (FriendsType & {status : string, cooldown : string})[]
  hasPendingRequest: FriendRequest[];
}

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  notificationCount: any;
  users: User[];
}

export const UserListModal = ({
  isOpen,
  onClose,
  isDarkTheme,
  users,
}: UserListModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);
  const { setUsers } = useChatStore();
  const socket = useSocket();
  const { isUsersLoading, getUsers, hasMore } = useChatStore();
  const [isModalUserFetched, setIsModalUserFetched] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUsers() {
      await getUsers();
    }
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        const entry = entries[0];
        if (entry.isIntersecting && !isUsersLoading && hasMore) {
          fetchUsers();
          setIsModalUserFetched(true);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isOpen, users, hasMore]);

  useEffect(() => {
    console.log(
      "heifberibuifberiubef i <IJDIERIBERIGBERIGBERIGBERIUGBEIGB></IJDIERIBERIGBERIGBERIGBERIUGBEIGB>"
    );
    if (!isModalUserFetched) return;
    console.log("insde the use eefffect in the user listmdoa ");
    socket?.on(Events.FRIEND_REQUEST_ACCEPTED, (data) => {
      console.log(
        "inside the user list mdoal  friend request accepted event",
        data
      );
      const requestAcceptedUser = data.payload.receiverInfo;
      const filteredUserAfterAccepted = users.filter(
        (user) => user._id !== requestAcceptedUser._id
      );
      setUsers(filteredUserAfterAccepted);
    });
    socket?.on(Events.FRIEND_REQUEST_REJECTED, (data) => {
      users.forEach((user) => {
        if (user._id === data.receiverId) {
          user.hasPendingRequest.push(data.payload.friendRequest);
        }
      });
      console.log("users socket event reject requested", users);
    });
  }, [socket, users]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
              isDarkTheme ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-2xl font-bold ${
                  isDarkTheme ? "text-white" : "text-gray-800"
                }`}
              >
                Add Friends
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl hover:bg-opacity-10 transition-colors duration-300 ${
                  isDarkTheme ? "hover:bg-white" : "hover:bg-gray-800"
                }`}
              >
                <X className={isDarkTheme ? "text-white" : "text-gray-800"} />
              </button>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              isDarkTheme={isDarkTheme}
            />

            <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {filteredUsers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-8 ${
                    isDarkTheme ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {isUsersLoading
                    ? null
                    : `No users found matching ${searchQuery}`}
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <UserCardModal
                      key={user._id}
                      user={user}
                      isDarkTheme={isDarkTheme}
                    />
                  ))}
                </AnimatePresence>
              )}
              <div
                ref={loaderRef}
                className="flex justify-center items-center py-4"
              >
                {isUsersLoading && (
                  <Loader className="animate-spin text-gray-200" />
                )}
                {!hasMore && null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
