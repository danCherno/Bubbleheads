import { Schema, model } from "mongoose";
interface IUser {
  username: string;
  email: string;
}

// Define the Lobby type
interface ILobby {
  _id: Schema.Types.ObjectId;
  name: string;
}

// Define the LobbyUser type, extending Document
interface ILobbyUser extends Document {
  lobby: ILobby;
  user: IUser;
}
export const lobbyUsersSchema = new Schema({
  lobby: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Lobby",
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
});

export const LobbyUsersModel = model<ILobbyUser>("LobbyUser", lobbyUsersSchema);
