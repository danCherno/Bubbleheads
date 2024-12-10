import { LobbyModel } from "../../models/lobbyModel";
import { LobbyMessagesModel } from "../../models/lobbyMessagesModel";

export async function getLobbyMessages(req: any, res: any)
{
    try
    {
        const {lobby} = req.body;
        const lobbyId = await LobbyModel.findOne({name: lobby});
        const messages = await LobbyMessagesModel.find({lobby: lobbyId});

        if(!messages) throw new Error("error getting messages");

        res.status(200).json({messages});
    }
    catch(error: any)
    {
        res.status(500).json({message: error.message});
        console.error(error);
    }
}