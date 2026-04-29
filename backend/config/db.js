import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        
        if (!uri) {
            console.error("❌ ERROR: MONGODB_URI is not defined in environment variables.");
            console.error("Please add MONGODB_URI to your Render Environment settings.");
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
}

export default connectDB;
