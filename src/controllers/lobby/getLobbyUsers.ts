import { LobbyUsersModel } from "../../models/lobbyUsersModel";

export async function getLobbyUsers(req: any, res: any) {
  try {

    const { lobby } = req.body;
    const users = await LobbyUsersModel.find({ lobby: lobby });

    if (!users) throw new Error("error getting users");
    res.status(200).json({ users });
    
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
}
