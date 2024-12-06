import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { Server } from "socket.io";
import http from "http";

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Or specify your frontend URL
    methods: ["GET", "POST"],
  },
});

export const secretKey = "1234";
export const saltRounds = 10;

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const dbUrl = process.env.DB_URL;
const database = "bubbleheads";

mongoose
  .connect(`${dbUrl}/${database}`)
  .then(() => {
    console.info("DB connected");
  })
  .catch((err) => {
    console.error(err);
  });

//connecting to socketIO
io.on("connection", async (socket) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) throw new Error("user has no cookies");
    const token = cookies.split('; ').find(row => row.startsWith('user='))?.split('=')[1];
   const authorized =  await checkUser(token);
   if (authorized) {
    console.log("User authorized");
  } else {
    console.log("User not authorized");
    socket.disconnect(); 
  }
    socket.on("message", (msg) => {
      console.log("Message received:", msg);
      io.emit("response", msg);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    });
  } catch (error) {
    console.error(error);
  }
});
//routes
import userRouter from "./routes/user/userRoutes";
app.use("/api/users", userRouter);
import roomRouter from "./routes/room/roomRoutes";
import { checkUser } from "./controllers/users/checkUser";
app.use("/api/rooms", roomRouter);

server.listen(port, () => {
  console.log(`BubbleHead server is up on http://localhost:${port}`);
});
