import { disconnect } from "../controllers/socket/socketDisconnect";
import { message } from "../controllers/socket/socketMessage";
import { sendUsers } from "../controllers/socket/socketSendUsers";
import { updatePosition } from "../controllers/socket/socketUpdatePosition";
import { io } from "../server";

export function onSocketConnect(socket: any)
{
    try {
    
        if (!socket.user) throw new Error("no name found");
        const roomId = socket.user.roomId; 
 
        socket.join(roomId);
    
        socket.to(roomId).emit("user-joined", socket.user);
        
        socket.on("update-position", (x:number,y:number) => updatePosition(socket,x,y));
        socket.on("send-users", () => sendUsers(socket));
        socket.on("message", (msg:string) => message(socket, msg));
        socket.on("disconnect", () => disconnect(socket));

      } catch (error) {
        console.error(error);
      }
    
}