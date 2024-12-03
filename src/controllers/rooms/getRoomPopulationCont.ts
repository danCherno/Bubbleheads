import { RoomUserModel } from "../../models/linkingTable/RoomUserModel";

export async function getRoomPopulation(req: any, res: any) {
  try {
    const { id } = req.body; 
    const length = (await RoomUserModel.find({roomID:id})).length;
    res.json({message:`success! you got population`,length})
  } catch (error) {
    console.error("Error during population check:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
