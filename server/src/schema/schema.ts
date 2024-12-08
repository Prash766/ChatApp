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

export const FileSchema = z.object({
    originalname: z.string().min(1, { message: "Original file name is required" }),
    mimetype: z.string().min(1 , { message: "MIME type is required" }),
    buffer: z.any(),
  });
  