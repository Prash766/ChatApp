import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

const uploadCloudinary = async(filePath : string)=>{
try {
        const res = await cloudinary.uploader.upload(filePath)
        console.log(res.secure_url)
        fs.unlinkSync(filePath)
        return res.secure_url
        
    
} catch (error) {
    console.log(error)
    fs.unlinkSync(filePath)
    
    
}}





export{
    uploadCloudinary
}