import mongoose , { ObjectId, Schema } from "mongoose";

export enum Status {
    PENDING= "PENDING",
    ACCEPTED="ACCEPTED",
    REJECTED = "REJECTED"
}

export interface FriendRequestType{
    senderId : ObjectId,
    receiverId : ObjectId,
    status  : Status
}

const FriendRequestSchema = new Schema<FriendRequestType>({
 senderId:{
    type: mongoose.Types.ObjectId,
    ref: "User" 
 },
 receiverId:{
    type:mongoose.Types.ObjectId,
    ref: "User"
 },
 status:{
    type:String,
    enum : Object.values(Status),
    default: Status.PENDING 
 }
}, {timestamps:true})

FriendRequestSchema.index({senderId : 1 , recieverId: 1} , {unique: true}  )

export const FriendRequest = mongoose.model<FriendRequestType>("friendrequest" , FriendRequestSchema)
