import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  Smile,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useDropzone } from "react-dropzone";
import ChatMessages from "./ChatMessages";
import { useChatStore } from "@/store/useStore";
import { ImagePreview } from "./media/ImagePreview";
import { VideoPreview } from "./media/VideoPreview";
import { VideoModal } from "./media/VideoModal";
import ImageModal from "./media/ImageModal";
import { useSocket } from "@/contexts/SocketContext";
import { Socket } from "socket.io-client";
import TypingIndicator from "./TypingIndicator";
import ScrollToBottom from "./ScrollToBottom";
import { MessagesSkeleton } from "./MessagesSkeleton";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string[];
  createdAt: string;
}

const ChatWindow = () => {
  // Theme and core chat state
  const [message, setMessage] = useState("");
  const { isDarkTheme } = useTheme();
  const { isUserTyping, setIsUserTyping } = useChatStore();
  const socket = useSocket();

  // Chat store actions and state
  const {
    getMessages,
    messages,
    subscribeToMessages,
    unsubscribeFromMessages,
    selectedUser,
    sendMessages,
  } = useChatStore();

  // File handling refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videos, setVideos] = useState<{ url: string; thumbnail?: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [receiverId, setReceiverID] = useState<string>("");
  const [isScrollAtBottom, setIsScrollAtBottom] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [IsfirstMessageFetch , setIsFirstMessageFetch] = useState<boolean>(false)
  const SCROLL_THRESHOLD = 100
  const SCROLL_TOP_THRESHOLD = 50

  // Check if the scroll position is near the bottom
  const isAtBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;
      return scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
    }
    return true;
  };
  const handleScrollToBottom= ()=>{
    endOfMessagesRef.current?.scrollIntoView({behavior:"smooth"})
  }


  const handleScroll = async () => {
    if (!messagesContainerRef.current) return;
  
    const container = messagesContainerRef.current;
    const { scrollTop, scrollHeight } = container;
  
    setIsScrollAtBottom(!isAtBottom());
  
    if (scrollTop <= SCROLL_TOP_THRESHOLD && !isLoadingMore && useChatStore.getState().hasMoreMessages) {
      setIsLoadingMore(true);

  
      if (selectedUser?._id) {
        try {
          await getMessages(selectedUser._id);
            requestAnimationFrame(() => {
            if (messagesContainerRef.current) {
              const newScrollHeight = messagesContainerRef.current.scrollHeight;
              const heightDifference = newScrollHeight - scrollHeight;
              container.scrollTop = scrollTop + heightDifference;
            }
          });
        } finally {
          setIsLoadingMore(false);
        }
      }
    }
  };
  
  useEffect(() => {
    const initializeChat = async () => {
      if (selectedUser?._id) {
setIsFirstMessageFetch(true)
        try {
      await getMessages(selectedUser._id);
          setReceiverID(selectedUser._id);
        } catch (error) {
          
        }
        finally{
          setIsFirstMessageFetch(false)
        }
      }
    };

    initializeChat();
    subscribeToMessages(socket as Socket);

    return () => unsubscribeFromMessages(socket as Socket);
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const debouncedScroll = debounce(handleScroll, 100);
    container.addEventListener("scroll", debouncedScroll);
    
    return () => {
      container.removeEventListener("scroll", debouncedScroll);
    };
  }, []);

  useEffect(() => {
    if(IsfirstMessageFetch) return ;
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    
  }, [IsfirstMessageFetch]);
  const handleDroppedFiles = (droppedFiles: File[]) => {
    const fileArray: File[] = [];
    droppedFiles.forEach((file) => {
      fileArray.push(file);
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImageUrls((prev) => [...prev, imageUrl]);
      } else if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        setVideos((prev) => [...prev, { url: videoUrl }]);
      }
    });
    setFiles((prev) => [...prev, ...fileArray]);
  };

  // Handle file upload via drag and drop
  const { getRootProps,  isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      "video/*": [".mp4", ".webm"],
      "application/*": [".pdf", ".doc", ".docx"],
    },
    noClick: true,
    onDrop: handleDroppedFiles,
  });

  // Process dropped files


  // Handle file attachment button clicks
  const handleAttachmentClick = (type: "file" | "image" | "video") => {
    const inputRef = {
      file: fileInputRef,
      image: imageInputRef,
      video: videoInputRef,
    }[type];

    inputRef?.current?.click();
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      setImageUrls((prev) => [...prev, imageUrl]);
      setFiles((prev) => [...prev, file]);
    });
  };

  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach((file) => {
      const videoUrl = URL.createObjectURL(file);
      setVideos((prev) => [...prev, { url: videoUrl }]);
      setFiles((prev) => [...prev, file]);
    });
  };

  // Remove uploaded media
  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Send message handler
  const handleSendButton = async () => {
    if (!message && imageUrls.length === 0 && videos.length === 0 && files.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("text", message);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await sendMessages(formData);
      if (res.status === 200) {
        setMessage("");
        setImageUrls([]);
        setVideos([]);
        setFiles([]);
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Typing indicator handlers
  const handleTypingStop = () => {
    const data = {
      typing: "typing",
      payload: {
        senderId: localStorage.getItem("userId") as string,
        receiverId: receiverId,
        isTyping: false,
      },
    };
    setIsUserTyping(data.payload);
    socket?.emit("typing", data);
  };

  const handleTypingStart = () => {
    const data = {
      typing: "typing",
      payload: {
        senderId: localStorage.getItem("userId") as string,
        receiverId: receiverId,
        isTyping: true,
      },
    };
    setIsUserTyping(data.payload);
    socket?.emit("typing", data);
  };

  // Keyboard event handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!["Enter", "Alt", "Shift", "Tab"].includes(e.key)) {
      handleTypingStart();
      if (timeoutId.current) clearTimeout(timeoutId.current);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendButton();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!["Enter", "Alt", "Shift", "Tab"].includes(e.key)) {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(handleTypingStop, 2000);
    }
  };

  // Utility function for debouncing scroll events
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  return (
    <div ref={chatWindowRef} className="flex-1 flex flex-col h-[calc(100vh-64px)] mt-16">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 border-b flex items-center justify-between transition-colors duration-300 ${
          isDarkTheme ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={selectedUser?.profilePic}
            className="w-10 h-10 rounded-full object-cover"
            alt="User avatar"
          />
          <div>
            <h2 className={`font-medium transition-colors duration-300 ${
              isDarkTheme ? "text-white" : "text-gray-900"
            }`}>
              {selectedUser?.fullName}
            </h2>
            <p className="text-sm text-gray-500 transition-colors duration-300">
              {isUserTyping?.isTyping && 
               isUserTyping.receiverId === localStorage.getItem("userId") 
                ? "typing..." 
                : "online"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-4 relative ${
          isDarkTheme ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {/* Loading indicator */}
        {isLoadingMore && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}

      {IsfirstMessageFetch ? (
        <MessagesSkeleton />
      ) : (
        messages?.map((message: Message) => (
          <ChatMessages key={message._id} message={message} />
        ))
      )}

        {/* Typing indicator */}
        {isUserTyping?.isTyping && 
         isUserTyping.receiverId === localStorage.getItem("userId") && (
          <TypingIndicator />
        )}

        {/* Scroll anchor */}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Media Previews */}
      <ImagePreview
        setSelectedImage={setSelectedImage}
        images={imageUrls}
        onRemove={removeImage}
      />
      <VideoPreview
        videos={videos}
        onRemove={removeVideo}
        onPreview={(url) => setSelectedVideo(url)}
      />

      {/* Message Input Area */}
      <div
        {...getRootProps()}
        className={`p-4 border-t transition-colors duration-300 ${
          isDarkTheme ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => console.log(e.target.files)}
          accept=".pdf,.doc,.docx"
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleImageUpload}
          accept="image/*"
        />
        <input
          ref={videoInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleVideoUpload}
          accept="video/*"
        />


        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAttachmentClick("file")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            <Paperclip
              className={`${
                isDarkTheme ? "text-white" : ""
              } transition-colors duration-300`}
              size={20}
            />
          </button>
          <button
            onClick={() => handleAttachmentClick("image")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            <ImageIcon
              className={`${
                isDarkTheme ? "text-white" : ""
              } transition-colors duration-300`}
              size={20}
            />
          </button>
          <button
            onClick={() => handleAttachmentClick("video")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            <VideoIcon
              className={`${
                isDarkTheme ? "text-white" : ""
              } transition-colors duration-300`}
              size={20}
            />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder="Type a message..."
            className={`flex-1 p-2 rounded-full border transition-colors duration-300 ${
              isDarkTheme
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-gray-100 border-gray-200"
            }`}
          />
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
            <Smile
              className={`${
                isDarkTheme ? "text-white" : ""
              } transition-colors duration-300`}
              size={20}
            />
          </button>
          <button
            onClick={handleSendButton}
            className={`p-2 rounded-full transition-all duration-300 ${
              message ||
              imageUrls.length > 0 ||
              videos.length > 0 ||
              files.length > 0
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
                : "bg-blue-300 cursor-default text-gray-200"
            }`}
          >
            <Send size={20} />
          </button>
        </div>

        {isDragActive && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
            <p
              className={`text-lg ${
                isDarkTheme ? "text-white" : "text-gray-900"
              }`}
            >
              Drop files here to send
            </p>
          </div>
        )}
      </div>
      {
        isScrollAtBottom ? (
          <div className="flex w-full justify-center items-center">
          <ScrollToBottom handleScrollToBottom={()=> handleScrollToBottom()} files= {files}/>
          </div>
    
        ): null

      }
      <VideoModal
        videoUrl={selectedVideo || ""}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
      <ImageModal
        imageUrlArray={imageUrls}
        selectedImage={selectedImage || 0}
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default ChatWindow;
