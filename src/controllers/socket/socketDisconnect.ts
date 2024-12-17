import { io } from "../../server";

export function disconnect(socket:any)
{
    if (!socket.user) throw new Error("no name found");
    
    const roomId = socket.user.roomId;

    io.to(roomId).emit("user-left",socket.user.id);
}