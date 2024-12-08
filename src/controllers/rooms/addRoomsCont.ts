import { LobbyModel } from "../../models/lobbyModel";


export async function addRoom(req: any, res: any) {
  try {
    const { name } = req.body;
 
       const newRoom =await LobbyModel.create({name});
    res.json({message:`success! room called ${name} was created`})
  } catch (error) {
    console.error("Error during room creation:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
