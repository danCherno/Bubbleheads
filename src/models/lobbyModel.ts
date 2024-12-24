import {Schema, model} from 'mongoose';

export const LobbySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type: String,
        defaultValue: "admin"
    },
    password:{
        type: String,
        required: false
    },  
    theme: {
        type: String,
        enum: ["club","desert","snow","space"],
        required: true,
    }
})

export const LobbyModel = model("Lobby", LobbySchema);