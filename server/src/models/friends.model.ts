import mongoose , { ObjectId, Schema } from "mongoose";

export enum Status {
    PENDING= "PENDING",
    ACCEPTED="ACCEPTED",
    REJECTED = "REJECTED"
}

export interface FriendRequestType{
    senderId : ObjectId,
    receiverId : ObjectId,
    status  : Status,
    cooldown : Date
}

const FriendRequestSchema = new Schema<FriendRequestType>({
 senderId:{
    type: mongoose.Types.ObjectId,
    ref: "User" ,
    required:true
 },
 receiverId:{
    type:mongoose.Types.ObjectId,
    ref: "User",
    required:true
 },
 status:{
    type:String,
    enum : Object.values(Status),
    default: Status.PENDING 
 },
 cooldown:{
   type:Date,
   default: null

 }
}, {timestamps:true})

FriendRequestSchema.index({senderId : 1 , receiverId: 1} , {unique: true}  )

export const FriendRequest = mongoose.model<FriendRequestType>("friendrequest" , FriendRequestSchema)
