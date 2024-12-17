import { io } from "../../server";

export function updatePosition(socket: any, x: number, y: number) {
  try {
    if (!socket.user) throw new Error("no name found");

    const id = socket.user.id;
    const roomId = socket.user.roomId;

    socket.user.position = { x, y };
    io.to(roomId).emit("change-position", x, y, id);
    
  } catch (error: any) {
    console.error("Error in sendUsers function:", error);
    socket.emit("error", { message: error.message });
  }
}
