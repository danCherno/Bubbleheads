import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import jwt from "jwt-simple";
import { LobbyUsersModel } from "./models/lobbyUsersModel";

const app = express();
const port = 3000;

export const secretKey = process.env.SECRET_KEY || "1234";
export const saltRounds = process.env.SALT_ROUNDS || 3;

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

const dbUrl = process.env.DB_URL;
const database = "bubbleheads";

//db connection
mongoose
  .connect(`${dbUrl}/${database}`)
  .then(() => {
    console.info("DB connected");
  })
  .catch((err) => {
    console.error(err);
  });

//routes
import userRouter from "./routes/userRoutes";
app.use("/api/users", userRouter);
// Lobby functions are managed via Socket.IO, no routes needed
import roomRouter from "./routes/roomRoutes";
app.use("/api/rooms", roomRouter);

//socket initialization
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Or specify your frontend URL
    methods: ["GET", "POST"],
  },
});

declare module "socket.io" {
  interface Socket {
    user?: { id: string; name: string; roomId: string }; // Define the 'user' property type
  }
}

io.use(async (socket, next) => {
  const cookies = socket.handshake.headers.cookie;

  if (!cookies) {
    return next(new Error("No cookies found"));
  }

  const parsedCookies = parseCookies(cookies);
  if (!parsedCookies) throw new Error("cookie no good");

  const token = parsedCookies;
  if (!token) {
    return next(new Error("Authentication error: No token found"));
  }
  const userId = jwt.decode(token, secretKey).userId;

  const room = await LobbyUsersModel.findOne({ user: userId })
    .populate("user", "username email")
    .populate("lobby", "name")
    .exec();
  if (!room) throw new Error("user not in a room");

  const user = room.user;
  if (!user) throw new Error("failed populating user");

  const name = room.user.username;
  const lobbyId = room.lobby._id.toString(); 
 
  
  socket.user = { id: userId, name: name, roomId: lobbyId };
  next();
});

// Utility function to parse cookies
function parseCookies(cookieString: string): string | undefined {
  return cookieString
    .split("; ")
    .find((row: string) => row.startsWith("user="))
    ?.split("=")[1];
}

//connection to socketIO
io.on("connection", (socket) => {
  try {
    if (!socket.user) throw new Error("no name found");
    const roomId = socket.user.roomId; 

    socket.join(roomId);

    // socket event handling for the authorized user
    socket.on("message", (msg) => {
      if (!socket.user) throw new Error("no name found");
      const name = socket.user.name;
      io.to(roomId).emit("response", name + " : " + msg);
    });

    socket.on("disconnect", () => {
        if (!socket.user) throw new Error("no name found");
    });
  } catch (error) {
    console.error(error);
  }
});

server.listen(port, () => {
  console.log(`BubbleHead server is up on http://localhost:${port}`);
});
