// import { motion, AnimatePresence } from "framer-motion";
// import { X, UserPlus, Check } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";

// interface User {
//   _id: string;
//   fullName: string;
//   email: string;
//   profilePic: string;
// }

// interface UserListModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   isDarkTheme: boolean;
//   users: User[];
// }

// export const UserListModal = ({ isOpen, onClose, isDarkTheme, users }: UserListModalProps) => {
//   const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

//   const handleSendRequest = (userId: string) => {
//     setSentRequests(prev => new Set([...prev, userId]));
//     toast.success("Friend request sent successfully!", {
//       duration: 3000,
//     });
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             onClick={e => e.stopPropagation()}
//             className={`w-full max-w-md p-6 rounded-lg shadow-xl ${
//               isDarkTheme ? "bg-gray-800" : "bg-white"
//             }`}
//           >
//             <div className="flex items-center justify-between mb-6">
//               <h2 className={`text-xl font-bold ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
//                 Add Friends
//               </h2>
//               <button
//                 onClick={onClose}
//                 className={`p-2 rounded-full hover:bg-opacity-10 ${
//                   isDarkTheme ? "hover:bg-white" : "hover:bg-gray-800"
//                 }`}
//               >
//                 <X className={isDarkTheme ? "text-white" : "text-gray-800"} />
//               </button>
//             </div>

//             <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//               {users.map(user => (
//                 <motion.div
//                   key={user._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className={`p-4 rounded-lg ${
//                     isDarkTheme ? "bg-gray-700" : "bg-gray-50"
//                   } flex items-center justify-between`}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <img
//                       src={user.profilePic}
//                       alt={user.fullName}
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                     <div>
//                       <h3 className={`font-medium ${isDarkTheme ? "text-white" : "text-gray-800"}`}>
//                         {user.fullName}
//                       </h3>
//                       <p className={`text-sm ${isDarkTheme ? "text-gray-300" : "text-gray-600"}`}>
//                         {user.email}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {!sentRequests.has(user._id) ? (
//                     <button
//                       onClick={() => handleSendRequest(user._id)}
//                       className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
//                     >
//                       <UserPlus size={20} />
//                     </button>
//                   ) : (
//                     <div className="p-2 rounded-full bg-green-500 text-white">
//                       <Check size={20} />
//                     </div>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { SearchBar } from "./SearchBar";
import { UserCard } from "./UserCard";

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
              isDarkTheme 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};