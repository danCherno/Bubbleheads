import {Schema, model} from 'mongoose';

export const LobbySchema = new Schema({
    name:{
        type:String,
        required:true
    }
})

export const LobbyModel = model("lobby", LobbySchema);