import { motion } from 'framer-motion';
import { useChatStore } from '../store/useStore';
import { useTheme } from '@/contexts/ThemeContext';
import { Message } from './ChatWindow';
import MediaGallery from './modals/MediaGallery';

interface MessageProp {
  message: Message,
}

const ChatMessages = ({ message }: MessageProp) => {
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
    <div className={`mb-4 ${isOwnMessage ? 'flex justify-end' : 'flex justify-start'}`}>
      <div className="flex items-end gap-2 max-w-[70%]">
        {!isOwnMessage && (
          <img
            src={selectedUser?.profilePic}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            alt="User avatar"
          />
        )}
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-lg p-3 transition-colors duration-300 ${
            isOwnMessage
              ? 'bg-green-700 text-white'
              : isDarkTheme
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-900'
          }`}
        >
          {message.image && message.image.length > 0 && message.image[0] !== '' && (
            <div className="mb-2">
              <MediaGallery media={message.image} isDarkTheme={isDarkTheme} />
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