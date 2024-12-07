import {Schema, model} from 'mongoose';

export const lobbyUsersSchema = new Schema({
    lobby:{
        type: Schema.Types.ObjectId,
        required:true
    },
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        unique:true
    }
});

export const LobbyUsersModel = model("lobbyUsers", lobbyUsersSchema);