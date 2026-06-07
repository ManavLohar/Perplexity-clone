import { useDispatch } from "react-redux";
import { sendMessage, deleteChat, getChats, getMessages } from "../chat.api";
import { initializeSocketConnection } from "../services/chat.socket";
import {
  createNewChat,
  addNewMessage,
  setCurrentChatId,
  setLoading,
  setChats,
  addMessages,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();
  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    const data = await sendMessage({ message, chatId });
    const { chat, aiMessage } = data;
    if (!chatId) {
      dispatch(createNewChat({ chatId: chat._id, title: chat.title }));
    }
    dispatch(
      addNewMessage({ chatId: chat._id, content: message, role: "user" }),
    );
    dispatch(
      addNewMessage({
        chatId: chat._id,
        content: aiMessage.content,
        role: aiMessage.role,
      }),
    );
    dispatch(setCurrentChatId(chat._id));
    dispatch(setLoading(false));
  }

  async function handleGetChats() {
    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId, chats) {
    if (chats[chatId]?.messages.length === 0) {
      const data = await getMessages({ chatId });
      const { messages } = data;

      const formattedMessages = messages?.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));
      dispatch(addMessages({ chatId, messages: formattedMessages }));
    }
    dispatch(setCurrentChatId(chatId));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
