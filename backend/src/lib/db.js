import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    console.log("📡 MongoDB URI found, connecting...");
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    console.log("🔍 Full error:", error);
  }
};
