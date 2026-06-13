import mongoose from "mongoose";
import "dotenv/config";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  isConnected = true;
}
