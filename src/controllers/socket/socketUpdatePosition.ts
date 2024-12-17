import { io } from "../../server";

export function updatePosition(socket:any, x:number, y:number)
{
    if (!socket.user) throw new Error("no name found");
    
    const id = socket.user.id;
    const roomId = socket.user.roomId;
    
    io.to(roomId).emit("change-position", x, y, id);
}