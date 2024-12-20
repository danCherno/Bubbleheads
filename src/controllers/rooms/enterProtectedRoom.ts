import { LobbyUsersModel } from "../../models/lobbyUsersModel";
import { LobbyModel } from "../../models/lobbyModel";
import jwt from 'jwt-simple';
import { secretKey } from "../../server";

export async function enterProtectedRoom(req: any, res: any) {
  try {
    const { id, password } = req.body;
    const { user } = req.cookies;

    const room = await LobbyModel.findById(id);
    if(!room) throw new Error("couldnt get the room");
    
    if (room.password !== password) return res.json({auth: false});

    const decryptedUser= jwt.decode(user,secretKey);
    if(!decryptedUser) throw new Error("error decoding user");
    
    const newRoom = await LobbyUsersModel.create({user:decryptedUser.userId, lobby:id});

    res.json({message:`success! room called ${newRoom} was entered`, auth: true});
  } catch (error) {
    console.error("Error during room creation:", error);
    return res.status(500).json({ message: "Server error", error});
  }
}
