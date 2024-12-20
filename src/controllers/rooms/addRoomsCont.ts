import { LobbyModel } from "../../models/lobbyModel";
import jwt from 'jwt-simple';
import { secretKey } from "../../server";


export async function addRoom(req: any, res: any) {
  try {
    const { name } = req.body;
    const { user } = req.cookies;

    const decryptedUser= jwt.decode(user,secretKey);
    if(!decryptedUser) throw new Error("error decoding user")

    const newRoom =await LobbyModel.create({name: name, owner: decryptedUser.email});
    res.json({message:`success! room called ${name} was created`})
  } catch (error) {
    console.error("Error during room creation:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
