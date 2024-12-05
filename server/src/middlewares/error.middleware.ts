import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { Error } from "mongoose";

const errorMiddleware= (err:Error | ApiError ,req :Request, res:Response ,next:NextFunction) : void =>{
    let message= ""
    let status= 500
    if( err instanceof ApiError){
        message = err.message
        status = err.status
    }
    console.log(err)

     res.status(status).json({
        message:message || "Internal Server Error"
    })
    

}

export default errorMiddleware