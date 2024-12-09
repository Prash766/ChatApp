import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './db/db';
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'

connectDB().catch((error)=>{
  console.log("Database connection error",error )
})
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});
const app = express();
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials:true
}));
app.use(express.json())
app.use(cookieParser())
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL 
  }
});

io.on('connection', (socket) => {
  console.log(`User has connected ${socket.id}`);

  socket.on('join_room', () => {
    socket.join('room1');
  });

  socket.on('new_message', (data) => {
    const { message } = data;
    socket.to('room1').emit('new_message', { message });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected`);
  });
});

import userRoutes from './routes/auth.routes'
import messageRouter from './routes/messages.routes'
import errorMiddleware from './middlewares/error.middleware';
app.use('/api/v1/auth' , userRoutes)
app.use('/api/v1/messages', messageRouter)




app.use(errorMiddleware)







server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


