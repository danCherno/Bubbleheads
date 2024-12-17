import { io } from "../../server";

export function message(socket: any, msg: string) {
  try {
    if (!socket.user) throw new Error("No user found on socket");

    if (msg === "") return;

    const roomId = socket.user.roomId;
    const name = socket.user.name;

    if (!roomId || !name) throw new Error("Room ID or user name not found");

    io.to(roomId).emit("response", name, msg, socket.user.id);
  } catch (error: any) {
    console.error("Error in message function:", error);
    socket.emit("error", { message: error.message });
  }
}
