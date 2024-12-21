import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  Smile,
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

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string[];
  createdAt: string;
}

const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const { isDarkTheme } = useTheme();
  const {isUserTyping , setIsUserTyping} = useChatStore()
  const {
    getMessages,
    messages,
    isMessagesLoading,
    isMessageSending,
    subscribeToMessages,
    unsubscribeFromMessages,
    selectedUser,
    sendMessages,
  } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videos, setVideos] = useState<{ url: string; thumbnail?: string }[]>(
    []
  );
  const [files, setFiles] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [receiverId, setReceiverID] = useState<string>("");
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const socket = useSocket();

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await getMessages(selectedUser?._id as string);
      if (
        res.data.messages[res.data.messages.length - 1].receiverId ===
        localStorage.getItem("userId")
      ) {
        console.log(res.data.messages[res.data.messages.length - 1].senderId);
        setReceiverID(res.data.messages[res.data.messages.length - 1].senderId);
      } else {
        console.log(res.data.messages[res.data.messages.length - 1].receiverId);
        setReceiverID(
          res.data.messages[res.data.messages.length - 1].receiverId
        );
      }
    };
    fetchMessages();
    subscribeToMessages(socket as Socket);

    return () => unsubscribeFromMessages(socket as Socket);
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);
  useEffect(() => {
    const handleTyping = (data: {
      type: string;
      payload: {
        senderId: string;
        receiverId: string;
        isTyping: boolean;
      };
    }) => {
      console.log("Typing event received:", data);
      console.log("is typing", data.payload.isTyping);
      setIsUserTyping(data.payload);
    };

    socket?.on("typing", handleTyping);

    return () => {
      socket?.off("typing", handleTyping);
    };
  }, [socket]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      "video/*": [".mp4", ".webm"],
      "application/*": [".pdf", ".doc", ".docx"],
    },
    noClick: true,
    onDrop: (droppedFiles) => {
      handleDroppedFiles(droppedFiles);
    },
  });

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

  const handleAttachmentClick = (type: "file" | "image" | "video") => {
    const inputRef = {
      file: fileInputRef,
      image: imageInputRef,
      video: videoInputRef,
    }[type];

    inputRef?.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      setImageUrls((prev) => [...prev, imageUrl]);
      setFiles((prev) => [...prev, file]);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach((file) => {
      const videoUrl = URL.createObjectURL(file);
      setVideos((prev) => [...prev, { url: videoUrl }]);
      setFiles((prev) => [...prev, file]);
    });
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((file, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((file, i) => i !== index));
  };

  const handleSendButton = async () => {
    if (
      !message &&
      imageUrls.length === 0 &&
      videos.length === 0 &&
      files.length === 0
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("text", message);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await sendMessages(formData);

      if (res.status === 200) {
        console.log("Message sent successfully", res);
        setMessage("");
        setImageUrls([]);
        setVideos([]);
        setFiles([]);
      } else {
        console.error("Failed to send message", res);
      }
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const handleTypingStop = () => {
    const data = {
      typing: "typing",
      payload: {
        senderId : localStorage.getItem("userId") as string,
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
        senderId : localStorage.getItem("userId") as string,
        receiverId: receiverId,
        isTyping: true,
      },
    };
    setIsUserTyping(data.payload);
    socket?.emit("typing", data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key !== "Enter" &&
      e.key !== "Alt" &&
      e.key !== "Shift" &&
      e.key !== "Tab"
    ) {
      handleTypingStart();
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key !== "Enter" &&
      e.key !== "Alt" &&
      e.key !== "Shift" &&
      e.key !== "Tab"
    ) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        handleTypingStop();
      }, 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] mt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 border-b flex items-center justify-between transition-colors duration-300 ${
          isDarkTheme
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={selectedUser?.profilePic}
            className="w-10 h-10 rounded-full object-cover"
            alt="Chat avatar"
          />
          <div>
            <h2
              className={`font-medium transition-colors duration-300 ${
                isDarkTheme ? "text-white" : "text-gray-900"
              }`}
            >
              {selectedUser?.fullName}
            </h2>
            <p className="text-sm text-gray-500 transition-colors duration-300">
              3 members • 2 online
            </p>
          </div>
        </div>
      </motion.div>
      <div
        className={`flex-1 overflow-y-auto p-4 ${
          isDarkTheme ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {messages?.map((message: Message) => {
          return <ChatMessages key={message._id} message={message}  />;
        })}

        {(isUserTyping?.isTyping && isUserTyping.receiverId === localStorage.getItem("userId") ) && (
          <div className="flex items-start p-2 ml-2">
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 flex gap-2 items-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

      </div>

      <ImagePreview
        setSelectedImage={(index) => setSelectedImage(index)}
        images={imageUrls}
        onRemove={removeImage}
      />
      <VideoPreview
        videos={videos}
        onRemove={removeVideo}
        onPreview={(url) => setSelectedVideo(url)}
      />

      <div
        {...getRootProps()}
        className={`p-4 border-t transition-colors duration-300 ${
          isDarkTheme
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
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
