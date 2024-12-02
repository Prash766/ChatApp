import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Login } from "@/components/Login";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import {SignupForm} from "@/components/SignupForm";

export const AuthPage = () => {
  const location = useLocation();
  const {isDarkTheme} = useTheme()

  // Determine whether to show Login or Signup based on the current route
  const isLogin = location.pathname === "/login";

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
        isDarkTheme ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${
              isDarkTheme ? "#1e40af" : "#3b82f6"
            } 0%, transparent 50%)`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {isLogin ? (
            <Login />
          ) : (
            <SignupForm />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
