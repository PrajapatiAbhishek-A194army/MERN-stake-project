import mongoose from "mongoose";
export const connectDB = async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongodb connetcted successfully ${conn.connection.host}`)
    } catch (error) {
        console.log(`mongodb connection failed ${error}`)   
    }
}