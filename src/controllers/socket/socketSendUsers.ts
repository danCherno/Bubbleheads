import { io } from "../../server";

export function sendUsers(socket: any) {
  try {
    if (!socket.user) {
      throw new Error("No user found on socket");
    }

    const roomId = socket.user.roomId;
    const room = io.sockets.adapter.rooms.get(roomId);

    if (room) {
      const users = Array.from(room)
        .map((socketId) => {
          const userSocket = io.sockets.sockets.get(socketId);
          return userSocket?.user || null; // Include user data from each socket
        })
        .filter(Boolean); // Filter out null values

      socket.emit("show-users", users);
    } else {
      socket.emit("show-users", []); // No users in the room
    }
  } catch (error: any) {
    console.error("Error in sendUsers function:", error);
    socket.emit("error", { message: error.message });
  }
}
