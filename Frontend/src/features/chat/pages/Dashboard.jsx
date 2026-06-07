import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { setCurrentChatId } from "../chat.slice";
import remarkGfm from "remark-gfm";
import { IoMdSend } from "react-icons/io";
import { RiLoader2Fill } from "react-icons/ri";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  } = useChat();
  const { currentChatId, chats, isLoading } = useSelector(
    (state) => state.chat,
  );
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
  }, []);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }
    handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    handleOpenChat(chatId, chats);
  };

  return (
    <main className="h-screen w-full flex bg-neutral-800">
      <div className="max-w-75 w-full p-4 border border-r-neutral-700">
        <h3 className="text-2xl font-semibold text-white">perplexity</h3>
        <div className="flex flex-col gap-2 mt-2 text-white">
          {Object.values(chats)
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
            .map((chat, index) => (
              <button
                onClick={() => openChat(chat.id)}
                key={index}
                className={`p-2 rounded-md text-sm text-left outline-none cursor-pointer ${currentChatId === chat.id && "bg-neutral-700"}`}
              >
                <p>{chat.title}</p>
              </button>
            ))}
        </div>
      </div>
      <div className="flex-10 flex justify-center overflow-hidden">
        <div
          className={`flex flex-col relative max-w-200 min-w-100 w-full h-screen py-2`}
        >
          <div
            className={`flex flex-col gap-4 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden ${currentChatId && "flex-1"}`}
          >
            {chats[currentChatId]?.messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`flex p-2 rounded-md ${message.role === "user" ? "ml-auto max-w-120 bg-neutral-700" : "mr-auto p-4"}`}
                >
                  <div className="text-white">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-2 list-disc pl-5">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 list-decimal pl-5">{children}</ol>
                        ),
                        code: ({ children }) => (
                          <code className="rounded bg-white/10 px-1 py-0.5">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">
                            {children}
                          </pre>
                        ),
                      }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className={`flex flex-col gap-2 w-full ${!currentChatId ? "my-auto" : "mt-auto"}`}
          >
            {!currentChatId && (
              <h3 className="text-center text-4xl font-semibold text-neutral-400 mb-4">
                perplexity
              </h3>
            )}
            <div className="w-full flex gap-2 relative">
              <input
                className="w-full px-4 py-4 text-white rounded-lg border bg-neutral-900 outline-none border-neutral-700"
                type="text"
                placeholder="Ask what do you want?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                disabled={isLoading}
                onClick={handleSubmitMessage}
                className="flex w-15 h-15 justify-center items-center text-white rounded-full cursor-pointer absolute right-0 top-0"
              >
                {isLoading ? (
                  <RiLoader2Fill size={25} className="animate-spin" />
                ) : (
                  <IoMdSend size={25} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
