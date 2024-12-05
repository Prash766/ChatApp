import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'
const verifyJWT = asyncHandler(async(req , res , next)=>{
    const token = req.cookies['auth-token']
    console.log("COOKIES",req.cookies)
    console.log("TOKEN",token)
    if(!token){
        throw new ApiError("Token Not Found", 400)
    }
    try {
        const decodedToken = await jwt.verify(token , process.env.JWT_SECRET_KEY as string)
        if(!decodedToken){
            throw new ApiError("Invalid Token" , 400)

        }
        next()
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Something Went Wrong!"
        })
    
    }

})

export default verifyJWT