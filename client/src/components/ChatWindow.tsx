import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  Smile,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useDropzone } from "react-dropzone";
import ChatMessages from "./ChatMessages";
import { useChatStore } from "@/store/useStore";
import { MessagesSkeleton } from "./MessagesSkeleton";
import { ImagePreview } from "./media/ImagePreview";
import { VideoPreview } from "./media/VideoPreview";
import { VideoModal } from "./media/VideoModal";

export const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const { isDarkTheme } = useTheme();
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    setSelectedUser,
    sendMessages,
  } = useChatStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videos, setVideos] = useState<{ url: string; thumbnail?: string }[]>(
    []
  );
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      await getMessages(selectedUser?._id as string);
    };
    fetchMessages();
  }, [selectedUser, getMessages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      "video/*": [".mp4", ".webm"],
      "application/*": [".pdf", ".doc", ".docx"],
    },
    noClick: true,
    onDrop: (files) => {
      handleDroppedFiles(files);
    },
  });

  const handleDroppedFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImageUrls((prev) => [...prev, imageUrl]);
      } else if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        setVideos((prev) => [...prev, { url: videoUrl }]);
      }
    });
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
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      setImageUrls((prev) => [...prev, imageUrl]);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const videoUrl = URL.createObjectURL(file);
      setVideos((prev) => [...prev, { url: videoUrl }]);
    });
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendButton = async () => {
    const res = await sendMessages({ text: message });
    console.log(res);
    if(res.status===200){
      setMessage("")
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

      <ChatMessages />

      <ImagePreview images={imageUrls} onRemove={removeImage} />
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
            disabled={!message} 
            className={`p-2 rounded-full transition-all duration-300 ${
              message
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
    </div>
  );
};
