import { motion } from 'framer-motion';
import { useChatStore } from '../store/useStore';
import { useTheme } from '@/contexts/ThemeContext';
import { Message } from './ChatWindow';

interface MessageProp{
  message:Message,
}

const ChatMessages = ({ message } : MessageProp) => {
  const { isDarkTheme } = useTheme();
  const { selectedUser } = useChatStore();
  
  
  const isOwnMessage = message.senderId === localStorage.getItem('userId');

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 transition-colors duration-300 ${
        isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div
        className={`flex items-end gap-2 ${
          isOwnMessage ? 'justify-end' : 'justify-start'
        }`}
      >
        {!isOwnMessage && (
          <img
            src={selectedUser?.profilePic}
            className="w-8 h-8 rounded-full object-cover"
            alt="User avatar"
          />
        )}
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-[70%] rounded-lg p-3 transition-colors duration-300 ${
            (isOwnMessage&& message)
              ? 'bg-green-700 text-white'
              : isDarkTheme
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-900'
          }`}
        >
          {message.image && message.image.length > 0 && message.image[0] !== '' && (
            <div className="mb-2 space-y-2">
              {message.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Message attachment ${index + 1}`}
                  className="rounded-lg max-w-full h-auto"
                />
              ))}
            </div>
          )}
          
          {message?.text && (
            <p className="break-words">{message.text}</p>
          )}
          
          <span
            className={`text-xs mt-1 block ${
              isOwnMessage ? 'text-green-100' : 'text-gray-500'
            }`}
          >
            {formatTime(message?.createdAt)}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatMessages;
