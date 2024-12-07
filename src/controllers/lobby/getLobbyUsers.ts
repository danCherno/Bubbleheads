import { LobbyModel } from "../../models/lobbyModel";
import { LobbyUsersModel } from "../../models/lobbyUsersModel";

export async function getLobbyUsers(req: any, res: any)
{
    try
    {
        const {lobby} = req.body;
        const lobbyId = await LobbyModel.findOne({name: lobby});
        const users = await LobbyUsersModel.find({lobby: lobbyId});

        if(!users) throw new Error("error getting users");

        res.status(200).json({users});
    }
    catch(error: any)
    {
        res.status(500).json({message: error.message});
        console.error(error);
    }
}