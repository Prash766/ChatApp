import { useTheme } from "@/contexts/ThemeContext";
import { useChatStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Image } from "lucide-react";
import { useEffect, useState } from "react";
import { Message } from "./ChatWindow";
const UserCard = ({ chat }: any) => {

  const { isDarkTheme } = useTheme();
  const { setSelectedUser, selectedUser, fetchedMessageOnce } = useChatStore();
  const isSelected = selectedUser?._id === chat._id;
  const { onlineUsers, isUserTyping } = useChatStore();
  const [messages , setMessages] = useState<Array<Message>>([])
  const [isFetched, setIsFetched] = useState<boolean>(false);

  useEffect(() => {
    console.log("is user typing", isUserTyping);
    async function fetchMessageSpecificToUser() {
     const res: any = await fetchedMessageOnce(chat._id);
      console.log("messages", messages);
      setMessages(res.messages)
      console.log("inside the user card getmessages" , messages)
      setIsFetched(true)
    }
    fetchMessageSpecificToUser();
  }, []);

  const lastMessage = messages[messages.length - 1];

  return (
    <motion.div
      onClick={() => setSelectedUser(chat)}
      whileHover={{ scale: 1.01 }}
      className={`p-4 cursor-pointer border-b transition-all duration-300 ${
        isDarkTheme
          ? isSelected
            ? "bg-gray-700 border-gray-500"
            : "border-gray-700 hover:bg-gray-800"
          : isSelected
          ? "bg-gray-200 border-gray-400"
          : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={chat.profilePic}
            className="w-12 h-12 rounded-full object-cover"
            alt={`${chat.fullName}'s avatar`}
          />
          {onlineUsers.includes(chat._id) ? (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          ) : (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3
              className={`font-medium truncate transition-colors duration-300 ${
                isDarkTheme ? "text-white" : "text-gray-900"
              }`}
            >
              {chat.fullName}
            </h3>
            <span
              className={`text-xs whitespace-nowrap ml-2 transition-colors duration-300 ${
                isDarkTheme ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {chat.timestamp}
            </span>
          </div>
          <div className="flex justify-between items-center">
          <p
  className={`text-sm truncate flex transition-colors duration-300 ${
    isDarkTheme ? "text-gray-400" : "text-gray-600"
  }`}
>
  {isFetched? isUserTyping ? (
    <div className={`${isUserTyping?.isTyping && isUserTyping.senderId === chat._id ? "text-green-500" :  null}`}>
      {isUserTyping?.isTyping && isUserTyping.senderId === chat._id
        ? "Typing....."
        :  (
          localStorage.getItem("userId") !== lastMessage?.senderId ? (
            lastMessage?.text ? (
              lastMessage?.text && lastMessage?.image.length === 0 ? (
                lastMessage.text
              ) : (
                <>
                  <Image /> <span>&nbsp;</span> {lastMessage.text}
                </>
              )
            ) : (
              <span >
                <Image /> <span>&nbsp;</span>
                <span>Photo</span>
              </span>
            )
          ) : (
            <>
              <span>Me:<>&nbsp;</> </span>
              {lastMessage?.text ? (
                lastMessage?.text && lastMessage?.image.length === 0 ? (
                  lastMessage.text
                ) : (
                  <>
                    <Image /> <span>&nbsp;</span> {lastMessage.text}
                  </>
                )
              ) : (
                <>
                  <Image /> <span>&nbsp;</span>
                  <span>Photo</span>
                </>
              )}
            </>
          )
        ) }
    </div>
  ) : (
    localStorage.getItem("userId") !== lastMessage?.senderId ? (
      lastMessage?.text ? (
        lastMessage?.text && lastMessage?.image.length === 0 ? (
          lastMessage.text
        ) : (
          <>
            <Image /> <span>&nbsp;</span> {lastMessage.text}
          </>
        )
      ) : (
        <>
          <Image /> <span>&nbsp;</span>
          <span>Photo</span>
        </>
      )
    ) : (
      <>
        <span>Me:<>&nbsp;</> </span>
        {lastMessage?.text ? (
          lastMessage?.text && lastMessage?.image.length === 0 ? (
            lastMessage.text
          ) : (
            <>
              <Image /> <span>&nbsp;</span> {lastMessage.text}
            </>
          )
        ) : (
          <>
            <Image /> <span>&nbsp;</span>
            <span>Photo</span>
          </>
        )}
      </>
    )
  ) : null
}
</p>


            {chat.unreadCount > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;