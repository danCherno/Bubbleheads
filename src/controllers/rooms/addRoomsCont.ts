import { LobbyModel } from "../../models/lobbyModel";
import jwt from 'jwt-simple';
import { secretKey } from "../../server";


export async function addRoom(req: any, res: any) {
  try {
    const { name, password,theme } = req.body;
    const { user } = req.cookies;

    const decryptedUser= jwt.decode(user,secretKey);
    if(!decryptedUser) throw new Error("error decoding user")
      if (password){
    const newRoom =await LobbyModel.create({name: name, owner: decryptedUser.email,password:password, theme:theme});
  }else {const newRoom =await LobbyModel.create({name: name, owner: decryptedUser.email, theme:theme});}
    res.json({message:`success! room called ${name} was created`})
  } catch (error) {
    console.error("Error during room creation:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
