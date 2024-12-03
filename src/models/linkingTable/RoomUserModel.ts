import {Schema, model} from 'mongoose';

export const RoomUserSchema = new Schema({
    roomID:{
        type:String,
        require:true,
    },
    userID:{
        type:String,
        require:true,
        unique:true,
    }
});

export const RoomUserModel =  model("RoomUser",RoomUserSchema);