import ChatPagePlaceholder from "@/components/ChatPagePlaceholder"
import { ChatSidebar } from "@/components/ChatSidebar"
import  ChatWindow  from "@/components/ChatWindow"
import { useSocket } from "@/contexts/SocketContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuthStore } from "@/store/useAuthStore"
import { useChatStore } from "@/store/useStore"
import { useEffect } from "react"

const ChatPage = () => {
  const {isDarkTheme} = useTheme()
  const {selectedUser , onlineUsers , setOnlineUsers } = useChatStore()
  const  {getUserInfo , setUserInfoLoading}= useAuthStore()

  const socket =useSocket()

    useEffect(()=>{
      socket?.on("getOnlineUsers" ,(data)=>{
        console.log("online users received from the backend",data )
      })
      console.log("onkine users",onlineUsers)
      
  
    }, [socket , onlineUsers , setOnlineUsers])
    useEffect(() => {
  
      async function fetchUserInfo() {
        setUserInfoLoading( true)
        await getUserInfo()
        setUserInfoLoading(false)
      }
        fetchUserInfo();
    }, []);
  
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