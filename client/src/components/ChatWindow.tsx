import { useEffect,  useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Image, Video, Smile, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDropzone } from 'react-dropzone';
import ChatMessages from './ChatMessages';
import { useChatStore } from '@/store/useStore';

export const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const { isDarkTheme } = useTheme();
  const  {getMessages , isMessagesLoading, selectedUser , setSelectedUser} = useChatStore()
  useEffect(()=>{
    const fetchMessages=async ()=>{
      await getMessages(selectedUser?._id as string)
    }
    fetchMessages()

  },[selectedUser, getMessages])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': []
    },
    noClick: true,
    onDrop: (files) => {
      console.log(files);
    }
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] mt-16">

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 border-b flex items-center justify-between transition-colors duration-300 ${
          isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <img 
            src={`${selectedUser?.profilePic}`}
            className="w-10 h-10 rounded-full object-cover"
            alt="Chat avatar"
            />
          <div>
            <h2 className={`font-medium transition-colors duration-300 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {selectedUser?.fullName}
            </h2>
            <p className="text-sm text-gray-500 transition-colors duration-300">3 members • 2 online</p>
          </div>
        </div>
      </motion.div>
   

    
        <ChatMessages/>

      <div 
        {...getRootProps()}
        className={`p-4 border-t transition-colors duration-300 ${
          isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
            <Paperclip className={`${isDarkTheme ? 'text-white' : ''} transition-colors duration-300`} size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
            <Image className={`${isDarkTheme ? 'text-white' : ''} transition-colors duration-300`} size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
            <Video className={`${isDarkTheme ? 'text-white' : ''} transition-colors duration-300`} size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 p-2 rounded-full border transition-colors duration-300 ${
              isDarkTheme 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-gray-100 border-gray-200'
            }`}
          />
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
            <Smile className={`${isDarkTheme ? 'text-white' : ''} transition-colors duration-300`} size={20} />
          </button>
          <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};