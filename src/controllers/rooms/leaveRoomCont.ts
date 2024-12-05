import { RoomUserModel } from "../../models/linkingTable/RoomUserModel";

export async function leaveRoom(req: any, res: any) {
  try {
    const { id } = req.body; 
    const roomLeave = await RoomUserModel.findOneAndDelete({userID:id});
    if(!roomLeave) throw new Error("no such user id in any room");
    res.json({message:`success! left room`,roomLeave})
  } catch (error) {
    console.error("Error during population check:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
