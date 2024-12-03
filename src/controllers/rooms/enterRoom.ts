import { RoomUserModel } from "../../models/linkingTable/RoomUserModel";
import jwt from 'jwt-simple';
import { secretKey } from "../../server";

export async function enterRoom(req: any, res: any) {
  try {
    const { id } = req.body;
    const { user } = req.cookies;
    const decryptedUser=await jwt.decode(user,secretKey);
    //console.log(decryptedUser);
    if(!decryptedUser) throw new Error("error decoding user")
       const newRoom =await RoomUserModel.create({userID:decryptedUser.userId,roomID:id});
    res.json({message:`success! room called ${newRoom} was created`})
  } catch (error) {
    console.error("Error during room creation:", error);
    return res.status(500).json({ message: "Server error", error});
  }
}
