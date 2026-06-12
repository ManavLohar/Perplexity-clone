import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IoIosLogOut, IoMdSend } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { SlNote } from "react-icons/sl";
import { RiLoader2Fill } from "react-icons/ri";
import Logout from "../../auth/components/Logout";
import { setCurrentChatId } from "../chat.slice";
import { FaBarsStaggered } from "react-icons/fa6";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const endOfMessagesRef = useRef(null);
  const messageCount = chats[currentChatId]?.messages?.length ?? 0;

  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
    if (currentChatId) {
      handleOpenChat(currentChatId, chats);
    }
  }, []);

  useEffect(() => {
    if (!currentChatId) return;
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatId, messageCount]);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    handleOpenChat(chatId, chats);
  };

  const markdownComponents = useMemo(
    () => ({
      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
      ul: ({ children }) => <ul className="mb-2 list-disc pl-5">{children}</ul>,
      ol: ({ children }) => (
        <ol className="mb-2 list-decimal pl-5">{children}</ol>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-2 border-l-4 border-neutral-600 bg-white/5 px-3 py-1 rounded-r-md">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="my-3 border-neutral-700" />,
      code: ({ inline, children }) => {
        if (inline) {
          return (
            <code className="rounded bg-white/10 px-1 py-0.5 text-[0.95em]">
              {children}
            </code>
          );
        }
        return <code>{children}</code>;
      },
      pre: ({ children }) => (
        <pre className="mb-2 overflow-x-auto max-w-full whitespace-pre-wrap rounded-xl bg-black p-3 border border-neutral-800">
          {children}
        </pre>
      ),
    }),
    [],
  );

  return (
    <main className="h-screen w-full flex bg-neutral-800">
      <div
        className={`absolute flex flex-col justify-between transition-all bg-neutral-800 z-10 ${isSidebarOpen ? "left-0" : "-left-75"} h-full md:relative md:left-0 max-w-75 w-full p-4 border border-r-neutral-700 md:flex md:flex-col`}
      >
        <div>
          <h3 className="text-2xl font-semibold text-cyan-500">perplexity</h3>
          <h3
            className="md:hidden absolute -right-10 top-5 text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBarsStaggered size={25} />
          </h3>

          <div className="flex flex-col gap-2 mt-2 text-white flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => dispatch(setCurrentChatId(null))}
              className="flex gap-2 items-center p-2 rounded-md text-sm text-left outline-none cursor-pointer hover:bg-neutral-700/60"
            >
              <SlNote />
              <p className="truncate">New Chat</p>
            </button>
            {Object.values(chats).length > 0 ? (
              <p>Recent chats</p>
            ) : (
              <p>No chats</p>
            )}
            {Object.values(chats)
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .map((chat, index) => (
                <button
                  onClick={() => openChat(chat.id)}
                  key={index}
                  className={`p-2 rounded-md text-sm text-left outline-none cursor-pointer ${currentChatId === chat.id ? "bg-neutral-700" : "hover:bg-neutral-700/60"}`}
                >
                  <p className="truncate">{chat.title}</p>
                </button>
              ))}
          </div>
        </div>

        {/* User short info at the bottom of the left chat history panel */}
        <div className="mt-3 sticky bottom-0 pt-3 border-t border-neutral-700 text-neutral-200 text-sm">
          {user ? (
            <div className="flex gap-2">
              <div className="min-w-full flex justify-between items-center">
                <div className="">
                  <div className="font-medium truncate">
                    {user?.username || user?.username || "User"}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {user?.email || ""}
                  </div>
                </div>
                <button
                  className="cursor-pointer"
                  onClick={() => setIsLogoutOpen(!isLogoutOpen)}
                >
                  <IoLogOutOutline size={25} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-neutral-400">Sign in to chat</div>
          )}
        </div>
      </div>

      <div className="flex-10 flex justify-center overflow-hidden">
        <div
          className={`flex flex-col pt-10 md:pt-4 relative max-w-200 w-full h-screen py-2`}
        >
          <div
            className={`flex flex-col p-3 gap-4 min-w-85 overflow-y-auto [&::-webkit-scrollbar]:hidden ${currentChatId && "flex-1"}`}
          >
            {chats[currentChatId]?.messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`flex p-2 rounded-md ${
                    message.role === "user"
                      ? "ml-auto min-w-80 max-w-120 bg-neutral-700"
                      : "mr-auto p-4 bg-neutral-900/30 border border-neutral-700"
                  }`}
                >
                  <div className="text-white w-full">
                    <ReactMarkdown
                      components={markdownComponents}
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}

            {/* keeps scroll pinned to bottom */}
            <div ref={endOfMessagesRef} />
          </div>

          <div
            className={`flex flex-col gap-2 w-full ${!currentChatId ? "my-auto" : "mt-auto"}`}
          >
            {!currentChatId && (
              <h3 className="text-center text-4xl font-semibold text-cyan-500 mb-4">
                perplexity
              </h3>
            )}
            <div className="relative flex min-w-85 w-full gap-2 px-3 py-2">
              <textarea
                className="w-full p-4 text-white rounded-lg border bg-neutral-900 outline-none border-neutral-700"
                rows={currentChatId ? 2 : 4}
                type="text"
                placeholder="Ask what do you want?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                disabled={isLoading}
                onClick={handleSubmitMessage}
                className="flex w-15 h-15 justify-center items-center text-white rounded-full cursor-pointer absolute right-3 top-2"
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
      <Logout isLogoutOpen={isLogoutOpen} setIsLogoutOpen={setIsLogoutOpen} />
    </main>
  );
};

export default Dashboard;
