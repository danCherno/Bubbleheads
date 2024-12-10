import {Schema, model} from 'mongoose';

export const lobbyMessagesSchema = new Schema({
    lobby:{
        type: Schema.Types.ObjectId,
        required:true
    },
    message:{
        type: Schema.Types.ObjectId,
        required:true,
        unique:true
    }
});

export const LobbyMessagesModel = model("lobbyMessages", lobbyMessagesSchema);