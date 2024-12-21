import { LobbyModel } from "../../models/lobbyModel";
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import { secretKey } from "../../server";
import { LobbyUsersModel } from "../../models/lobbyUsersModel";

export async function getRooms(req: any, res: any) {
  try {
    const { user } = req.cookies;

    const decryptedUser = jwt.decode(user, secretKey) 
    const email = decryptedUser.email;
    const rooms = await LobbyModel.find();
    res.json({message:`success! you got some rooms`, rooms, email})
  } catch (error) {
    console.error("Error during room creation:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
