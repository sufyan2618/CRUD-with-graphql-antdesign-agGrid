import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,)
        console.log("mongodb connected");
    } catch (error) {
        console.log("Error connecting database", error)
    }
}

export default connectDb;