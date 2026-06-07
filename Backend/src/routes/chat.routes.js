import { Router } from "express";
import {
  deleteChat,
  // deleteMessage,
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";
import { authUser } from "../middewares/auth.middleware.js";

const chatRouter = Router();

chatRouter
  .post("/message", authUser, sendMessage)
  .get("/", authUser, getChats)
  .get("/:chatId/messages", authUser, getMessages)
  .delete("/delete/:chatId", authUser, deleteChat);
// .delete("/delete/:messageId", authUser, deleteMessage);

export default chatRouter;
