import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  chat: {
    type: Schema.Types.ObjectId,
    ref: "chat",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
});

export const MessageModel = model("message", messageSchema);
