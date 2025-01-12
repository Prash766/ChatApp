import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Camera, Loader, Upload, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "@/store/useStore";


export const ProfilePage = () => {
  const { isDarkTheme } = useTheme();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const { updateProfile , getUserInfo, authUser , isUploading} = useAuthStore();
  const {onlineUsers} = useChatStore()
console.log(authUser)
  useEffect(()=>{ 
  const userInfo= async()=>{
    const res = await getUserInfo()
    console.log(res.data.user)
  }
  userInfo()
  },[])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  }, []);

  const removeAvatar = () => {
    setAvatar(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview("");
    }
  };
  const handleUpdateProfile = async () => {
    const res = await updateProfile(avatar!);
    if (res.status === 200) {
      toast.success("Profile Updated Successfully");
      setAvatar(null);
      setAvatarPreview("")
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5242880,
    multiple: false,
  });

  return (
    <div
      className={`min-h-screen  p-6 transition-colors duration-300 ${
        isDarkTheme ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-2xl mt-16 mx-auto rounded-2xl p-8 transition-colors duration-300 ${
          isDarkTheme ? "bg-gray-800" : "bg-white"
        } shadow-xl`}
      >
        <h1
          className={`text-3xl font-bold mb-8 transition-colors duration-300 ${
            isDarkTheme ? "text-white" : "text-gray-900"
          }`}
        >
          Profile
        </h1>

        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div
              {...getRootProps()}
              className={`relative w-40 h-40 rounded-full overflow-hidden cursor-pointer 
                ${isDragActive ? "ring-2 ring-blue-500" : ""} 
                transition-all duration-300`}
            >
              <input {...getInputProps()} />
              <img
                src={avatarPreview || authUser?.profilePic || ""}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 flex items-center justify-center 
                bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                transition-opacity duration-300`}
              >
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            {avatarPreview && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white 
                  hover:bg-red-600 transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          <p
            className={`mt-4 text-sm transition-colors duration-300 ${
              isDarkTheme ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Click or drag to update profile picture
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              value={authUser?.fullName || ""}
              disabled
              className={`w-full px-4 py-2 rounded-lg border transition-colors duration-300 ${
                isDarkTheme
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={authUser?.email || ""}
              disabled
              className={`w-full px-4 py-2 rounded-lg border transition-colors duration-300 ${
                isDarkTheme
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Member Since
            </label>
            <p
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
  {authUser?.createdAt
    ? format(new Date(authUser.createdAt), "MMMM dd, yyyy")
    : ""}
            </p>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDarkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Status
            </label>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  onlineUsers.includes(authUser?._id) ? "bg-green-500" : "bg-gray-500"
                }`}
              />
              <p
                className={`capitalize transition-colors duration-300 ${
                  isDarkTheme ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {onlineUsers.includes(authUser?._id) ? "Online": "Offline"}
              </p>
            </div>
          </div>
        </div>

        {avatar && (
          <motion.button
            onClick={handleUpdateProfile}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            disabled = {isUploading}
            className={`mt-8 w-full py-3 px-4 rounded-lg bg-blue-500 text-white 
                ${isUploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} 

              font-medium hover:bg-blue-600 transition-colors duration-300 
              flex items-center justify-center gap-2`}
          >
           {isUploading ? <Loader className="w-5 h-5 animate-spin"/>:  <Upload className="w-5 h-5" /> }
            Update Profile Picture
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
