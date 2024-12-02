import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Shield, Image, Video, Lock } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Experience instant messaging with real-time delivery and read receipts'
  },
  {
    icon: Users,
    title: 'Group Chats',
    description: 'Create and manage group conversations with unlimited participants'
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'End-to-end encryption ensures your conversations stay private'
  },
  {
    icon: Image,
    title: 'Media Sharing',
    description: 'Share photos and files seamlessly within your conversations'
  },
  {
    icon: Video,
    title: 'Video Messages',
    description: 'Send and receive video messages with crystal clear quality'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Advanced privacy controls to manage who can contact you'
  }
];

export const FeaturesSection = () => {
  const { isDarkTheme} = useTheme();

  return (
    <div className={`py-24 ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`text-3xl sm:text-4xl font-bold mb-4 ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}
          >
            Packed with Amazing Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-xl ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Everything you need for seamless communication
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-8 rounded-2xl ${
                isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'
              } hover:shadow-lg transition-all duration-300`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};