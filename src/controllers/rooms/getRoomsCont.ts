import { RoomModel } from "../../models/rooms/roomModel";
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import { secretKey } from "../../server";
import { RoomUserModel } from "../../models/linkingTable/RoomUserModel";

export async function getRooms(req: any, res: any) {
  try {
    const { user } = req.cookies;

    const decryptedUser = jwt.decode(user, secretKey) 
    //console.log(decryptedUser);
   //const population =RoomUserModel.find({roomId: }).length
    //todo check user exists is real 
    const rooms = await RoomModel.find();
    res.json({message:`success! you got some rooms`,rooms})
  } catch (error) {
    console.error("Error during room creation:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
