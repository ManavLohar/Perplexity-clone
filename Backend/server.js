import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT;

connectDB().catch((err) => {
  console.error("MongoDB connection error: ", err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
