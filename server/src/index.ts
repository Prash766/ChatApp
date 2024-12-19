import connectDB from "./db/db";
import { v2 as cloudinary } from "cloudinary";

connectDB().catch((error) => {
  console.log("Database connection error", error);
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

import userRoutes from "./routes/auth.routes";
import messageRouter from "./routes/messages.routes";
import errorMiddleware from "./middlewares/error.middleware";
import { app, server } from "./utils/socket";
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/messages", messageRouter);

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
