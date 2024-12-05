import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Loader, Upload, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

export const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const { isDarkTheme } = useTheme();
  const { signUpUser, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

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
      setAvatarPreview('');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880,
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullName', name);
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) {
      formData.append('profileImage', avatar);
    }
    
  const res = await  signUpUser(formData);
    console.log("res oijsbfiuwrbfwb", res)
    if (res.status===200) {
      console.log( "dfbeiufbweiubfwiuebfiw")
      navigate('/chat', { replace: false });
      toast.success("Signed Up Successfully");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full mt-14 max-w-md p-8 rounded-2xl shadow-lg ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex justify-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
          className="p-4 rounded-full bg-blue-500"
        >
          <UserPlus className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <h2 className={`text-3xl font-bold text-center mb-8 ${
        isDarkTheme ? 'text-white' : 'text-gray-900'
      }`}>
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div
            {...getRootProps()}
            className={`relative group cursor-pointer ${
              avatarPreview ? 'w-32 h-32' : 'w-full h-32'
            } rounded-full overflow-hidden ${
              isDragActive ? 'border-blue-500 border-2' : ''
            } ${
              isDarkTheme 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            } transition-all duration-300 ease-in-out`}
          >
            <input {...getInputProps()} />
            {avatarPreview ? (
              <>
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  className="w-full h-full object-fit"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0  transition-opacity duration-300 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <Upload className={`w-8 h-8 mb-2 ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-sm text-center ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Drop your profile picture here or click to select
                </p>
              </div>
            )}
          </div>
          {avatarPreview && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              onClick={removeAvatar}
              className="flex items-center space-x-1 text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
              <span>Remove photo</span>
            </motion.button>
          )}
        </div>

        <div>
          <div className={`relative rounded-lg border ${
            isDarkTheme 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className={`h-5 w-5 ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkTheme 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Full name"
              required
            />
          </div>
        </div>

        <div>
          <div className={`relative rounded-lg border ${
            isDarkTheme 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkTheme 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Email address"
              required
            />
          </div>
        </div>

        <div>
          <div className={`relative rounded-lg border ${
            isDarkTheme 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkTheme 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Password"
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSigningUp ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader className="animate-spin" />
              <span>Signing Up...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </motion.button>
      </form>

      <p className={`mt-8 text-center ${
        isDarkTheme ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Already have an account?{' '}
        <Link to='/login' className="text-blue-500 hover:text-blue-600 font-medium">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};