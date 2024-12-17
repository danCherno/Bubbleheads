import { io } from "../../server";

export function disconnect(socket:any)
{
    try {
        if (!socket.user) {
          console.error("No user data found for disconnecting socket.");
          return; 
        }
    
        const roomId = socket.user.roomId;
    
        if (!roomId) {
          console.error("No room ID found for user.");
          return; 
        }
    
        io.to(roomId).emit("user-left", socket.user.id);
      } catch (error:any) {
        console.error("Error during disconnect:", error.message);
      }
}