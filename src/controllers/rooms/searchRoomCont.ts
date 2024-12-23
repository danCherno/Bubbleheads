
import { LobbyModel } from "../../models/lobbyModel";
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import { secretKey } from "../../server";
import { LobbyUsersModel } from "../../models/lobbyUsersModel";

export async function getRoomsSearch(req: any, res: any) {
  try {
    const { user } = req.cookies;
    const name = req.params.name;
    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
  
      if (!name) {
        return res.status(400).json({ message: "Room name is required" });
      }
    const decryptedUser = jwt.decode(user, secretKey) 
    const email = decryptedUser.email;
    console.log(name);
    const rooms = await LobbyModel.find({name: { 
        $regex: name, 
        $options: 'i' }});
    res.json({message:`success! you got some rooms`, rooms, email})
  } catch (error) {
    console.error("Error during room creation:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
