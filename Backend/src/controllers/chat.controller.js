import { ChatModel } from "../models/chat.model.js";
import { MessageModel } from "../models/message.model.js";
import { generateResponse, generateTitle } from "../services/ai.service.js";

export async function sendMessage(req, res) {
  const { message, chatId } = req.body;

  let title = null,
    chat = chatId ? { _id: chatId } : null;

  if (!chatId) {
    title = await generateTitle(message);
    chat = await ChatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await MessageModel.create({
    chat: chat._id,
    content: message,
    role: "user",
  });

  const messages = await MessageModel.find({ chat: chat._id });

  const result = await generateResponse(messages);

  const aiMessage = await MessageModel.create({
    chat: chat._id,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    title,
    chat,
    aiMessage,
  });
}

export async function getChats(req, res) {
  const user = req.user;
  const chats = await ChatModel.find({ user: user.id });
  res.status(200).json({
    message: "Chats fetched successfully!",
    success: true,
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await ChatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found!",
      success: false,
    });
  }

  const messages = await MessageModel.find({ chat: chatId });
  return res.status(200).json({
    message: "Messages fetched successfully!",
    success: true,
    messages,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;
  const chat = await ChatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  await MessageModel.deleteMany({
    chat: chatId,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found!",
      success: false,
    });
  }

  res.status(200).json({
    message: "Chat deleted successfully!",
    success: true,
  });
}

// export async function deleteMessage(req, res) {
//   const { messageId } = req.params;

//   const message = await MessageModel.findOneAndDelete({
//     _id: messageId,
//   });

//   if (!message) {
//     return res.status(404).json({
//       message: "Message not found!",
//       success: false,
//     });
//   }

//   return res.status(200).json({
//     message: "Message deleted successfully!",
//     success: true,
//   });
// }
