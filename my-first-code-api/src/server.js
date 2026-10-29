import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import path from "path";
import authRoutes from "./routes/authRoutes.js";
import router from "./routes/index.js";

import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// app.use(cors())
// app.use(express.json());
const frontendPath = path.resolve(__dirname, "../../myfirstcode/dist");
app.use(cors({
  origin: true,          // reflects the request's Origin header back — works for any localhost port
  credentials: true,
}));
app.use(express.json());

app.use("/api", router);
app.use(express.static(frontendPath));

// React/Vite SPA fallback
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
app.use("/",(req,res)=>{
  res.json({"ok":"Route not found"})
})

const PORT = process.env.PORT ;
console.log({PORT})
app.listen(PORT, () => {
  console.log("Server Running");
});