import {Schema, model} from 'mongoose';

export const LobbySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type: String,
        defaultValue: "admin",
        ref: "User"
    }
})

export const LobbyModel = model("Lobby", LobbySchema);