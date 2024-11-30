import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb= async()=>{

    try {
        const conn= await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongooDb connected : ${conn.connection.host}`)
        
    } catch (error) {
        console.log("Mongoose connection errror",error);
        
    }
   
}