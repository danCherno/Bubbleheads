import { LobbyUsersModel } from "../../models/lobbyUsersModel";
import { secretKey } from "../../server";
import { parseCookies } from "./parseCookies";
import jwt from "jwt-simple";

export async function initSocket(socket: any, next: (error?: Error) => void) {
  try {
  const cookies = socket.handshake.headers.cookie;

  if (!cookies) {
    return next(new Error("No cookies found"));
  }

  const parsedCookies = parseCookies(cookies);
  if (!parsedCookies) throw new Error("cookie no good");

  const token = parsedCookies;
  if (!token) {
    return next(new Error("Authentication error: No token found"));
  }
  const userId = jwt.decode(token, secretKey).userId;

  const room = await LobbyUsersModel.findOne({ user: userId })
    .populate("user", "username email icon")
    .populate("lobby", "name")
    .exec();
  if (!room) throw new Error("user not in a room");

  const user = room.user;
  if (!user) throw new Error("failed populating user");

  const name = room.user.username;
  const icon = room.user.icon;
  const lobbyId = room.lobby._id.toString();

  socket.user = { id: userId, name: name, roomId: lobbyId ,icon:icon};
  next();
 } catch (error:any) {
    console.error(error); 
    next(new Error(error.message || "An error occurred during socket initialization"));
  }
}
