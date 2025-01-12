import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useStore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type PropsChildren = {
  children: ReactNode;
};

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: PropsChildren) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { setOnlineUsers } = useChatStore();
  const {isAuthenticated, authUser} = useAuthStore()

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // console.warn("No userId found, socket connection will not be established.");
      return;
    }
    const socketUrl = import.meta.env.VITE_SOCKET_URL as string;


    const socketInstance = io(socketUrl, {
      reconnection: true,
      query: {
        userId,
      },
      reconnectionAttempts: 5,
      transports: ['websocket']
    });

    setSocket(socketInstance);

    socketInstance.on("getOnlineUsers", (data) => {
      console.log("Online users received:", data);
      setOnlineUsers(data);
    });

    return () => {
      console.log("Socket disconnecting...");
      socketInstance.disconnect();
    };
  }, [setOnlineUsers, isAuthenticated , authUser?._id]);

  if (!socket) {
    return null;
  }

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    // console.warn("Socket is not initialized");
  }
  return socket;
};
