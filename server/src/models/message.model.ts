import mongoose, { Types } from "mongoose";

export type Message ={
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    text:string,
    image: string[]

}

const messageSchema = new mongoose.Schema<Message>({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref :"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
    },
    image: [{ 
        type: String
    }]
}
,{
    timestamps:true
})




export const Message = mongoose.model<Message>("message", messageSchema)