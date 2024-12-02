import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

type UserType ={
    fullName: string ,
    email: string,
    password:string,
    profilePic: string,
    generateToken: (payload: any )=> any,
    isPasswordValid: (password:string)=>boolean
}



const UserSchema =  new Schema<UserType>({
    fullName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,   
        select:false     
    },
    profilePic :{
        type:String,
        default:""

    },
    
},{
    timestamps:true
})

UserSchema.pre('save' ,async function(next){
if(!this.isModified(this.password)) next()
this.password = await bcrypt.hash(this.password , 10)
next()
})

UserSchema.methods.generateToken = async(payload: any )=>{
    const token = await jwt.sign(payload , process.env.JWT_SECRET_KEY as string , {
        expiresIn : process.env.JWT_EXPIRY
    })
    return token
}

UserSchema.methods.isPasswordValid  = async function(password: string){
    const isValid = await bcrypt.compare(password , this.password)
    return isValid

}


export const User = mongoose.model<UserType>('User', UserSchema)