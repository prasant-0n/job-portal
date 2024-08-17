import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri: string = process.env.MONGODB_URI || "";
if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
}

const connectDB = async (): Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(uri);
        console.log("MongoDB is connected to the DB Host:", connectionInstance.connection.host);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
