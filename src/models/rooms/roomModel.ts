import {Schema, model} from 'mongoose';

export const RoomSchema:Schema = new Schema({
    name:{
        type: String ,
        require:true,
    }
});

export const RoomModel = model("Room",RoomSchema);