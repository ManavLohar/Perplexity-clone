import cookieParser from "cookie-parser";
import express from "express";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://perplexity-clone-d030vwp2a-manav-lohars-projects.vercel.app",
    ],
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

app.use(express.static(path.join(__dirname, "dist")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

export default app;
