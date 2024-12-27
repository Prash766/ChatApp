import { UploadApiResponse } from "cloudinary";
import { Message } from "../models/message.model";
import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import { uploadCloudinary } from "../utils/cloudinary";
import { getReceiverSocketId, io } from "../utils/socket";
import { FriendRequest, Status } from "../models/friends.model";
import ApiError from "../utils/ApiError";
import mongoose from "mongoose";


const getUserModal = asyncHandler(async (req, res, next) => {
  try {
    const loggedUserId = req.user;
    console.log('Logged User ID:', loggedUserId); // Debug log
    const limit = 10;
    const cursor = req.query.cursor;

    const paginationMatch = cursor 
      ? { _id: { $gt: new mongoose.Types.ObjectId(cursor as string) } }
      : {};

    const filteredUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: loggedUserId },
          ...paginationMatch
        },
      },
      {
        $lookup: {
          from: "friendrequests",
          let: { currentUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ["$senderId", "$$currentUserId"] },
                            { $eq: ["$receiverId", new mongoose.Types.ObjectId(loggedUserId)] }
                          ]
                        },
                        {
                          $and: [
                            { $eq: ["$receiverId", "$$currentUserId"] },
                            { $eq: ["$senderId", new mongoose.Types.ObjectId(loggedUserId)] }
                          ]
                        } 
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: "friendshipStatus"
        }
      },
      {
        $addFields: {
          debug_friendshipCount: { $size: "$friendshipStatus" },
          debug_friendship: { $first: "$friendshipStatus" }
        }
      },
      {
        $match: {
          $expr: {
            $eq: [
              {
                $size: {
                  $filter: {
                    input: "$friendshipStatus",
                    as: "friendship",
                    cond: { $eq: ["$$friendship.status", Status.ACCEPTED] }
                  }
                }
              },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          hasPendingRequest: {
          
                  $filter: {
                    input: "$friendshipStatus",
                    as: "friendship",
                    cond: {
                      $and: [
                        { $eq: ["$$friendship.status", Status.PENDING] },
                        { $eq: ["$$friendship.senderId", new mongoose.Types.ObjectId(loggedUserId)] }
                      ]
                    }
                  }
          
              },
          
          }
        
      },
        
        {
          $project: {
            fullName: 1,
            email: 1,
            profilePic: 1,
            hasPendingRequest: {
              $map: {
                input: "$hasPendingRequest",
                as: "request",
                in: {
                  _id: "$$request._id",
                  senderId: "$$request.senderId",
                  receiverId: "$$request.receiverId",
                  status: "$$request.status",
                  createdAt: "$$request.createdAt"
                }
              }
            },
          }
        },
            { $limit: limit + 1 }
    ]);

    const cleanedUsers = filteredUsers.map(({...user }) => user);
    const hasMore = cleanedUsers.length > limit;
    if (hasMore) {
      cleanedUsers.pop();
    }

    const nextCursor = hasMore ? cleanedUsers[cleanedUsers.length - 1]._id : null;

    return res.status(200).json({
      success: true,
      data: {
        users: cleanedUsers,
        nextCursor,
        hasMore
      }
    });
  } catch (error) {
    console.error("Error getting users for modal:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

const getUsersSideBar = asyncHandler(async(req , res)=>{
  try {
    const user = await User.findById(req.user).populate({
      path: 'friends',
      select: '-friends',
    })

    if(!user){
      throw new ApiError("User not Found , Internal Server Error" , 400)
    }
    console.log( "USER FRIENDS ",user) 
    return res.status(200).json( {
      success:true,
      user  
    })
  } catch (error: any) {
    console.log( error)
    return res.status(400).json({
      success:false,
      message : error.message || "Internal Server Error"
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
    getUserModal,
    getMessages,
    sendMessages,
    getUsersSideBar
}