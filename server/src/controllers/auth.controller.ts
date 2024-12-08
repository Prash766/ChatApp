import { User } from "../models/user.model";
import { FileSchema, loginSchema, SignUpSchema } from "../schema/schema";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { uploadCloudinary } from "../utils/cloudinary";


const options ={
    path: '/',
    httpOnly: true,
    secure: process.env.ENV === 'PRODUCTION' ? true : false,
    maxAge : 1*24*60*60*1000
}


const loginUser = asyncHandler(async (req, res, next) => {
    const validate = loginSchema.safeParse(req.body)
    if(validate.error){
        throw new ApiError(validate.error.message,400)
    }
 
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError("Invalid Credentials", 400);
    }

    const isValid = await user.isPasswordValid(password);

    if (!isValid) {
      throw new ApiError("Invalid Credentials", 400);
    }
    const token = await user.generateToken({
        id: user._id
    })
    res.cookie("auth-token", token , options)
   return  res.status(200).json({ message: "Login successful" });

  } catch (error) {
    next(error);
  }
});

const signUpUser = asyncHandler(async(req , res , next)=>{
   try {
     const validate = SignUpSchema.safeParse(req.body)
     if(validate.error){
         throw new ApiError(validate.error.message,400)
     }
     console.log("Req file",req.file)
    
     const {fullName , email , password } = req.body
     let profilePic = ""
     const profileImage = req.file as Express.Multer.File || null
     if(profileImage.path)
     {
         const res = await uploadCloudinary(profileImage.path) as string
         profilePic = res 
 
     }
     const user = await User.create({
         fullName,
         email,
         password,
         profilePic
     })
     const payload = {
        id: user._id,
     }
     const token = user.generateToken(payload)
     res.cookie("auth-token", token , options)
     return res.status(200).json({
message:"User Signed Up",
user
     })
  
   } catch (error) {
    console.log(error)
    return res.status(500).json({
        message:"Something went wrong"
    })
   }
})


const logOutUser = asyncHandler(async(req , res , next)=>{
 try {
       res.cookie("auth-token","", options)
       return res.status(200).json({
           message:"Logged Out successfully"
       })
 } catch (error) {
    console.log(error)
    res.status(500).json({
        message:"Internal Server Error"
    })
    
 }
})


const updateProfile = asyncHandler(async(req , res , next)=>{
    console.log("FILE" , req.file)
    const validateImage= FileSchema.safeParse(req.file)
    if(validateImage.error){
        throw new ApiError(validateImage.error.message , 400)
    }
    let result:string= ""
    const updateImage = req.file as Express.Multer.File
    const userId = req.user
    const user = await User.findById(userId)
    if(!user) throw new ApiError("User not found", 400)
    if(updateImage.path){
        result = await uploadCloudinary(updateImage.path)  as string
    }
    user.profilePic = result
    await user.save()
    return res.status(200).json({
        message:"Profile Updated Successfully"
    })
}
)

const checkUser = asyncHandler(async(req , res, next)=>{
    return res.status(200).json({
        success:true,
      user:  req.user

    })
})

const userInfo = asyncHandler(async(req , res)=>{
    console.log(req.user)
    const id = req.user

    try {
        const user = await User.findById(id).select("-password")
        return res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Internal Server Error!"
        })
        
    }
})

export {
    loginUser,
    signUpUser,
    logOutUser,
    updateProfile,
    checkUser,
    userInfo
}