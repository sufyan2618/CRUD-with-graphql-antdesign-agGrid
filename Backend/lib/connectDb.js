import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,)
        console.log("mongodb connected");
    } catch (error) {
        console.log("Error connecting database", error)
    }
}

export default connectDb;