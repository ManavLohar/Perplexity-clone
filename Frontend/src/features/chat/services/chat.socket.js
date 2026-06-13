import { io } from "socket.io-client";

export const initializeSocketConnection = () => {
  const socket = io("https://perplexity-clone-bice.vercel.app", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    // console.log("Connected to socket.io server!");
  });
};
