import { ChatSidebar } from "@/components/ChatSidebar"
import { ChatWindow } from "@/components/ChatWindow"
import { useTheme } from "@/contexts/ThemeContext"

const ChatPage = () => {
  const {isDarkTheme} = useTheme()
  return (
    <div className={isDarkTheme ? 'dark' : ''}>
        <div className={`flex h-screen ${
          isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          <ChatSidebar />
          <ChatWindow />
          
        </div>
      </div>
  )
}

export default ChatPage