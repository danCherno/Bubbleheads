import {Schema, model} from 'mongoose';

export const UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
      type: String,
    }
})

export const UserModel = model("User", UserSchema);