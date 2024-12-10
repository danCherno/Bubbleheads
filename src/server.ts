import express from 'express';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'; 
import 'dotenv/config';
import { Server } from "socket.io";
import http from "http";
import jwt from 'jwt-simple';

const app = express()
const port = 3000;

export const secretKey = process.env.SECRET_KEY || "1234";
export const saltRounds = process.env.SALT_ROUNDS || 3;

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

const dbUrl = process.env.DB_URL;
const database = 'bubbleheads';

mongoose.connect(`${dbUrl}/${database}`).then(()=>{
    console.info("DB connected")
}).catch((err)=>{
    console.error(err)
});

//routes
import userRouter from './routes/userRoutes';
app.use("/api/users", userRouter);
import lobbyRouter from './routes/lobbyRoutes';
app.use("/api/lobby", lobbyRouter);
import roomRouter from './routes/roomRoutes';
import { isAuthorized } from './controllers/lobby/isAuthorized';
import { UserModel } from './models/userModel';
app.use("/api/rooms", roomRouter);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Or specify your frontend URL
    methods: ["GET", "POST"],
  },
});
declare module "socket.io" {
    interface Socket {
      user?: { id: string; name: string }; // Define the 'user' property type
    }
  }
io.use(async(socket, next) => {
    // Access cookies from the handshake headers
    const cookies = socket.handshake.headers.cookie;
  
    if (!cookies) {
      return next(new Error("No cookies found"));
    }
  
    // Parse cookies (using a utility function)
    const parsedCookies = parseCookies(cookies);
  
    // Retrieve the token from cookies
    const token = parsedCookies.token; // Example: if your token is stored in a 'token' cookie
  
    if (!token) {
      return next(new Error("Authentication error: No token found"));
    }
    const userId = jwt.decode(token, secretKey).userId;
    console.log(userId);
    const user = await UserModel.findOne({user: userId});
    if(!user) throw new Error("user not authorized")
    const name = user.email
    if(!name) throw new Error("user not authorized")
   // const users = await LobbyUsersModel.findOne({lobby}, {user: userId});

    // Verify the token (example using JWT)

  
      // Attach user data to the socket
      socket.user = { id: userId ,name:name};
  
      // Proceed with the connection
      next();
  
  });
  
  // Utility function to parse cookies
  function parseCookies(cookieString:any) {
    return cookieString
      .split(";")
      .map(cookie => cookie.trim().split("="))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: decodeURIComponent(value) }), {});
  }
  



//connecting to socketIO
io.on("connection",  (socket) => {
  try {

    console.log(`User connected: ${socket.id}`);
    
    // Continue with socket event handling for the authorized user
    socket.on("join-room", (roomId) => {
      console.log(`User ${socket.id} joined room: ${roomId}`);
      socket.join(roomId); // Join the user to a room
    });
  
 
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

server.listen(port, () => {
  console.log(`BubbleHead server is up on http://localhost:${port}`);
});
