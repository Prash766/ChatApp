import  { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Image, Video, Smile } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDropzone } from 'react-dropzone';

export const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
const {isDarkTheme} = useTheme()
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
    <div className="flex-1 flex flex-col h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 border-b flex items-center justify-between ${
          isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" 
            className="w-10 h-10 rounded-full object-cover"
            alt="Chat avatar"
          />
          <div>
            <h2 className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Group Name
            </h2>
            <p className="text-sm text-gray-500">3 members • 2 online</p>
          </div>
        </div>
      </motion.div>

      <div 
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-4 ${
          isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        {/* Messages will be rendered here */}
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop" 
              className="w-8 h-8 rounded-full object-cover"
              alt="User avatar"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`max-w-[70%] rounded-lg p-3 ${
                isDarkTheme 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-900'
              }`}
            >
              <p>Hey! How's it going?</p>
              <span className="text-xs text-gray-500 mt-1">12:30 PM</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div 
        {...getRootProps()}
        className={`p-4 border-t ${
          isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Paperclip className={isDarkTheme ? 'text-white' : ''} size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Image className={isDarkTheme ? 'text-white' : ''} size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Video className={isDarkTheme ? 'text-white' : ''} size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 p-2 rounded-full border ${
              isDarkTheme 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-gray-100 border-gray-200'
            }`}
          />
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Smile className={isDarkTheme ? 'text-white' : ''} size={20} />
          </button>
          <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};