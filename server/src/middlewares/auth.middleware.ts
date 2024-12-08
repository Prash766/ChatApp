import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'

interface JwtPayload  {
    id: string
}
const verifyJWT = asyncHandler(async(req , res , next)=>{
    const token = req.cookies['auth-token']
    if(!token){
        throw new ApiError("Token Not Found", 400)
    }
    try {
        const decodedToken = await jwt.verify(token , process.env.JWT_SECRET_KEY as string) as JwtPayload
        if(!decodedToken){
            throw new ApiError("Invalid Token" , 400)

        }
        console.log("decoded token" ,decodedToken)
        req.user = decodedToken.id
        next()
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Something Went Wrong!"
        })
    
    }

})

export default verifyJWT