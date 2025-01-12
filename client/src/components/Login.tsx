import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isDarkTheme } = useTheme();
  const navigate = useNavigate();
  const { isLoggingIn, loginUser ,setUserId} = useAuthStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    try {
      const res = await loginUser(data);
if (res?.status===200) {
        setUserId(res?.data.user._id)
        navigate("/chat", { replace: true });
      }
    } catch (error: any) {
      toast.error(`${error.message || "Login Failed"}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-md p-8 rounded-2xl shadow-lg ${
        isDarkTheme ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex justify-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
          className="p-4 rounded-full bg-blue-500"
        >
          <LogIn className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <h2
        className={`text-3xl font-bold text-center mb-8 ${
          isDarkTheme ? "text-white" : "text-gray-900"
        }`}
      >
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div
            className={`relative rounded-lg border ${
              isDarkTheme
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail
                className={`h-5 w-5 ${
                  isDarkTheme ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkTheme
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-50 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Email address"
              required
            />
          </div>
        </div>

        <div>
          <div
            className={`relative rounded-lg border ${
              isDarkTheme
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock
                className={`h-5 w-5 ${
                  isDarkTheme ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkTheme
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-50 text-gray-900 placeholder-gray-500"
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
          disabled={isLoggingIn}
          className="w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader className="animate-spin" />
              <span>Signing In ....</span>
            </div>
          ) : (
            "Sign In"
          )}
        </motion.button>
      </form>

      <p
        className={`mt-8 text-center ${
          isDarkTheme ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
};
