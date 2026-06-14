import mongoose from "mongoose";
import "dotenv/config";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  // const conn = await mongoose.connect("mongodb://localhost:27017/Perplexity");
  console.log(`MongoDB connected: ${conn.connection.host}`);
  isConnected = true;
}
