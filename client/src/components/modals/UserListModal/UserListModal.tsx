import { motion, AnimatePresence } from "framer-motion";
import { Loader, X } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { SearchBar } from "./SearchBar";
import { UserCard } from "./UserCard";
import { useChatStore } from "@/store/useStore";

interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkTheme: boolean;
  users: User[];
}

export const UserListModal = ({ isOpen, onClose, isDarkTheme, users }: UserListModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const loaderRef = useRef<HTMLDivElement>(null);
  const { isUsersLoading, getUsers, hasMore } = useChatStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        console.log(entries)
        const entry = entries[0];
        if (entry.isIntersecting && !isUsersLoading && hasMore) {
         
          getUsers()
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
  }, [isOpen, users , hasMore]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users.filter(
      user =>
        user.fullName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleSendRequest = (userId: string) => {
    setSentRequests(prev => new Set([...prev, userId]));
    toast.success("Friend request sent successfully!", {
      duration: 3000,
      className: isDarkTheme ? "dark-toast" : "",
    });
  };

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
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${
              isDarkTheme ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
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
                  className={`text-center py-8 ${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}
                >
                  No users found matching "{searchQuery}"
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filteredUsers.map(user => (
                    <UserCard
                      key={user._id}
                      user={user}
                      isDarkTheme={isDarkTheme}
                      isRequestSent={sentRequests.has(user._id)}
                      onSendRequest={handleSendRequest}
                    />
                  ))}
                </AnimatePresence>
              )}
              <div ref={loaderRef} className="flex justify-center items-center py-4">
                {isUsersLoading && <Loader className="animate-spin text-gray-200" />}
                {!hasMore && null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
