import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
export function getReceiverSocketId(userId : string){
    return userSocketMap.get(userId) 
    
}
const userSocketMap = new Map<string, string>()

io.on("connection", (socket) => {
    console.log(`Connection Established ${socket.id}`)

    const userId = socket.handshake.query.userId 
    if(userId) userSocketMap.set(userId as string , socket.id)

        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("disconnect", () => {
        userSocketMap.delete(userId as string);
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });

    socket.on("typing" , (data)=>{
      console.log(data)
      const receiverSocketId = getReceiverSocketId(data.payload.receiverId)
      console.log(receiverSocketId)
        if(receiverSocketId){
          const message = {
            type :"typing",
            payload:{
              senderId : userId,
              receiverId : data.payload.receiverId,
              isTyping : data.payload.isTyping  
              }
          }
            socket.to(receiverSocketId).emit("typing", message)
        }
    })

        
    
});


export { app, server, io };

