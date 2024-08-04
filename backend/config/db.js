import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Mongodb is connected to ${db.connection.host}`);
    } catch (error) {
        console.log(`There is an error connecting to mongodb: ${error.message}`);
    }
}

export default connectDB;