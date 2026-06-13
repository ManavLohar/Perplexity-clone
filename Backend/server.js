import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { createServer } from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT;
const httpServer = createServer(app);
// initSocket(httpServer);

connectDB().catch((err) => {
  console.error("MongoDB connection error: ", err);
  process.exit(1);
});

// app.listen(PORT, () => {
//   console.log("Server started on port", PORT);
// });

export default app;
