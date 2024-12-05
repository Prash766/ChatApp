import mongoose from 'mongoose'
import "dotenv/config";

const connectDB = async()=>{
    try {
        const conn= await mongoose.connect(`${process.env.MONGO_URI as string}/realchatapp`)
        console.log(`Database connected ${conn.connections[0].host} at port ${conn.connections[0].port}`)
        
    } catch (error) {
        console.log(`Error connecting to the DB` , error)
        process.exit(1)
        
    }
}

export default connectDB