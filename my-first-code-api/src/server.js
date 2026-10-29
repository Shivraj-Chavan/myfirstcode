import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

// app.use(cors())
// app.use(express.json());

app.use(cors({
  origin: true,          // reflects the request's Origin header back — works for any localhost port
  credentials: true,
}));
app.use(express.json());

app.use("/api", router);
app.use("/",(req,res)=>{
  res.json({"ok":"bhai ha  route nay bnvlas nytr route name chuklay"})
})

const PORT = process.env.PORT ;
console.log({PORT})
app.listen(PORT, () => {
  console.log("Server Running");
});