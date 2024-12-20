//imports
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import { initSocket } from "./controllers/socket/initSocket";
import { onSocketConnect } from "./routes/onSocketConnect";
import multer from 'multer';

// adding to socket import
declare module "socket.io" {
  interface Socket {
    user?: { id: string; name: string; roomId: string ,position?:{x:number,y:number} ,icon?:String}; // Define the 'user' property type
  }
}

const storage = multer.memoryStorage(); // Store the file in memory as a buffer
const upload = multer({ storage });

// server's variables initialization
const app = express();
const port = 3000;

// secret variables initialization
export const secretKey = process.env.SECRET_KEY || "1234";
export const saltRounds = process.env.SALT_ROUNDS || 3;

//db's variables initialization
const dbUrl = process.env.DB_URL;
const database = "bubbleheads";

// socket's variables initialization
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", // Or specify your frontend URL
    methods: ["GET", "POST"],
  },
});

// server configuration
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

//db connection
mongoose
  .connect(`${dbUrl}/${database}`)
  .then(() => {
    console.info("DB connected");
  })
  .catch((err) => {
    console.error(err);
  });

// routes (Lobby functions are managed via Socket.IO, no routes needed)
import userRouter from "./routes/userRoutes";
app.use("/api/users", userRouter);
import roomRouter from "./routes/roomRoutes";
app.use("/api/rooms", roomRouter);

// page routing
app.get("/lobby", (req, res) => {
    res.sendFile(path.join(__dirname, "/../public/lobby/lobby.html"))
});
app.get("/rooms", (req, res) => {
    res.sendFile(path.join(__dirname, "/../public/rooms/rooms.html"))
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/../public/login/login.html"))
});

//socket initialization and connection
io.use(initSocket)
io.on("connection", onSocketConnect);

//server initialization
server.listen(port, () => {
  console.log(`BubbleHead server is up on http://localhost:${port}`);
});
