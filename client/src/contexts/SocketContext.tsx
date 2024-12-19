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
  const {setOnlineUsers} = useChatStore()
  // const {userId} = useAuthStore()

  useEffect(() => {
    const userId =  localStorage.getItem("userId") || ""
    const socketInstance = io("http://localhost:3000", {
      reconnection: true,
      query:{
        userId
      },
      reconnectionAttempts: 5,
    });
    setSocket(socketInstance);
    socketInstance.on("getOnlineUsers", (data)=>{
      console.log(data)
      setOnlineUsers(data)
    })

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  if (!socket) {
    return null;
  }

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn("Socket is not initialized");
  }
  return socket;
};
