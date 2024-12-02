import { UploadApiResponse } from "cloudinary";
import { Message } from "../models/message.model";
import { User } from "../models/user. model";
import asyncHandler from "../utils/asyncHandler";
import { uploadCloudinary } from "../utils/cloudinary";

const getUserSidebar = asyncHandler(async(req , res, next)=>{
 try {
       const loggedUser = req.user
       const filteredUsers = await User.find({
           _id:{
               $ne: loggedUser
           }
       })
       return res.status(200).json({
         filteredUsers,
           
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

const sendMessages = asyncHandler(async(req , res , next)=>{
 try {
       const {id} = req.params
       const {text} = req.body
       const image  = req.file as Express.Multer.File
       let result = ""
       if(image){
            result = await uploadCloudinary(image.path) as string
       }
       const message = await Message.create({
           receiverId:id,
           senderId:req.user,
           text:text ? text: '',
           image : result ? result : ""
       })
       return res.status(200).json({
        message,
       })
 } catch (error) {
    console.log("Error while saving messages", error)
    
 }

})


export {
    getUserSidebar,
    getMessages,
    sendMessages
}