import express from 'express';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'; 
import 'dotenv/config';
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
app.use("/api/rooms", roomRouter);

app.listen(port, () => {
    console.log(`BubbleHead server is up!`)
  });