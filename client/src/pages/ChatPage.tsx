import ChatPagePlaceholder from "@/components/ChatPagePlaceholder"
import { ChatSidebar } from "@/components/ChatSidebar"
import  ChatWindow  from "@/components/ChatWindow"
import { useSocket } from "@/contexts/SocketContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useChatStore } from "@/store/useStore"
import { useEffect } from "react"

const ChatPage = () => {
  const {isDarkTheme} = useTheme()
  const {selectedUser , onlineUsers , setOnlineUsers} = useChatStore()

  const socket =useSocket()

    useEffect(()=>{
      socket?.on("getOnlineUsers" ,(data)=>{
        console.log("online users",data )
      })
      
  
    }, [socket , onlineUsers , setOnlineUsers])
  return (
    <div className={isDarkTheme ? 'dark' : ''}>
        <div className={`flex min-h-screen overflow-hidden ${
          isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          <ChatSidebar />
          {selectedUser?<ChatWindow /> : <ChatPagePlaceholder/>}
          
        </div>
      </div>
  )
}

export default ChatPage