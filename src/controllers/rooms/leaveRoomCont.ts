import { LobbyUsersModel } from "../../models/lobbyUsersModel";
import jwt from 'jwt-simple';
import { secretKey } from "../../server";

export async function leaveRoom(req: any, res: any) {
  try {
    const { user } = req.cookies;
    const decryptedUser= jwt.decode(user,secretKey).userId;
    const roomLeave = await LobbyUsersModel.findOneAndDelete({user:decryptedUser});
    res.json({message:`success! left room`,roomLeave})
  } catch (error) {
    console.error("Error during population check:", error);
    return res.status(500).json({ message: "Server error" });
  }
} 
