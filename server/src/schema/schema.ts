import {z } from 'zod'
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export const loginSchema = z.object({
    email: z.string().email({message:"Invalid Email Address"}),
    password: z.string()
})


export const SignUpSchema = z.object({
    fullName : z.string(),
    email: z.string().email({message:"Invalid Email Address"}),
    password: z.string().min(8, {message:"Must be more than 8 Characters"}),
 

})

export const FileSchema =  z.instanceof(File).refine(file => file.type.startsWith("image/"),{
    message:"File must be an Image!"
}).refine(file => file.size <=MAX_FILE_SIZE,{
    message: `File size must be under ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
})