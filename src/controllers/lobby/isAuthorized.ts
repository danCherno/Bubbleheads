import { LobbyModel } from "../../models/lobbyModel";
import { LobbyUsersModel } from "../../models/lobbyUsersModel";
import jwt from 'jwt-simple';
import { secretKey } from "../../server";
import { UserModel } from "../../models/users/userModel";

export async function isAuthorized(req: any, res: any)
{
    try
    {
        const {lobby} = req.body;
        const {user} = req.cookies;
        const lobbyId = await LobbyModel.findOne({name: lobby});

        const userId = jwt.decode(user, secretKey).userId;
        //const users = await LobbyUsersModel.findOne({lobby: lobbyId}, {user: userId}); // uncomment instead of next line when lobbyUser is configured
        const users = await UserModel.findOne({_id: userId});

        if(!users) throw new Error("error authorizing the user");

        res.status(200).json({users});
    }
    catch(error: any)
    {
        res.status(500).json({message: error.message});
        console.error(error);
    }
}