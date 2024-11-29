import express from 'express';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'; 
import 'dotenv/config';
const app = express()
const port = 3000;

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
/*import xRouter from './routes/x/xRoutes';
app.use("/api/x", xRouter);*/

app.listen(port, () => {
    console.log(`BubbleHead server is up!`)
  })