import ChatPagePlaceholder from "@/components/ChatPagePlaceholder"
import { ChatSidebar } from "@/components/ChatSidebar"
import  ChatWindow  from "@/components/ChatWindow"
import { useTheme } from "@/contexts/ThemeContext"
import { useChatStore } from "@/store/useStore"

const ChatPage = () => {
  const {isDarkTheme} = useTheme()
  const {selectedUser} = useChatStore()
  return (
    <div className={isDarkTheme ? 'dark' : ''}>
        <div className={`flex h-screen ${
          isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          <ChatSidebar />
          {selectedUser?<ChatWindow /> : <ChatPagePlaceholder/>}
          
        </div>
      </div>
  )
}

export default ChatPage