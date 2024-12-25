import { UploadApiResponse } from "cloudinary";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import { uploadCloudinary } from "../utils/cloudinary";
import { getReceiverSocketId, io } from "../utils/socket";
import { FriendRequest } from "../models/friends.model";

const getUserSidebar = asyncHandler(async(req , res, next)=>{
 try {
       const loggedUser = req.user
       const limit = 10
       const cursor = req.query.cursor
       console.log(cursor)
       
       const filteredUsers = await User.find({
           _id:{
               $ne: loggedUser,
               ...(cursor? {$gt: cursor} :  null)
           }
       }).limit(limit)
const users_after_aggregate = await FriendRequest.aggregate([

  {
    $match:{
      $or:[
       { senderId:req.user},
       { receiverId : req.user}
      ],
      status:"ACCEPTED"
    }
  }
])  
console.log( "users aggragate ", users_after_aggregate)     
       const prevCursor = cursor && filteredUsers.length>0 ? filteredUsers[0]._id : null
       const nextCursor = filteredUsers.length > 0? filteredUsers[filteredUsers.length -1]._id : null
       return res.status(200).json({
         filteredUsers,
         prevCursor,
         nextCursor,      
       })
 } catch (error) {
    console.log("Error getting users for Sidebar",error)
    return res.status(500).json({
        message:"Internal Server Error"
    })
    
 }
})

const getMessages = asyncHandler(async(req , res, next)=>{
   try {
    const {id} = req.params
    const sender_id = req.user
    const messages = await Message.find({
        $or:[
            {senderId  : sender_id , receiverId:id},
            {senderId : id ,receiverId : sender_id}
        ]
    })
    return res.status(200).json({
        success:true,
        messages
    })
    
   } catch (error) {
    console.log("Error fetching Messages", error)
    return res.status(500).json({
        message:"INternal Server Error"
    })
   }
})

const sendMessages = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params
      const { text } = req.body
      const images = req.files as Express.Multer.File[]; 
  
      const uploadedImages = [];
        if (images && images.length > 0) {
        for (const image of images) {
          const uploadedUrl = await uploadCloudinary(image.path)
          uploadedImages.push(uploadedUrl);
        }
      }
  console.log(uploadedImages)
      const message = await Message.create({
        receiverId: id,
        senderId: req.user, 
        text: text || "", 
        image: uploadedImages.length > 0 ? uploadedImages : [], 
      });

      const receiverSocketId = getReceiverSocketId(id)
      console.log("recceiver socket id",receiverSocketId)
      if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",message )
        console.log("messagesent")
      }
  
      return res.status(200).json({
        success: true,
        message: "Message sent successfully.",
        data: message,
      });
    } catch (error:any) {
      console.error("Error while saving messages:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send message.",
        error: error.message,
      });
    }
  });
  

export {
    getUserSidebar,
    getMessages,
    sendMessages
}