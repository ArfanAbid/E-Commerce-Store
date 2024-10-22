import mongoose from "mongoose";

const DB_NAME="E-Commerce-Store-db";


const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Error: ",error);
        process.exit(1);
        
    }
}


export default connectDB
