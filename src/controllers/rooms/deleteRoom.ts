import { LobbyModel } from "../../models/lobbyModel";

export async function deleteRoom(req: any, res: any)
{
    try
    {
        const roomId = req.params.roomId;
        await LobbyModel.findByIdAndDelete(roomId);

        res.status(200).json({ message: "Room deleted successfully" });
    }
    catch (error)
    {
        console.error("Error during room deletion:", error);
        return res.status(500).json({ message: "Server error" });
    }
}