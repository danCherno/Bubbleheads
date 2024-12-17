import { io } from "../../server";

export function message(socket:any, msg:string)
{
    if (!socket.user) throw new Error("no name found");

    const roomId = socket.user.roomId;
    const name = socket.user.name;
    
    io.to(roomId).emit("response", name , msg, socket.user.id);
}