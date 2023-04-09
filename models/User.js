import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    firstName: 
    {
        type:String,
        required:true, //It haas to be required
        min:2,
        max:50
    },

    lastName: 
    {
        type:String,
        required:true, //It haas to be required
        min:2,
        max:50
    },
    email:{
        type:String,
        required:true, //It haas to be required
        min:2,
        max:50,
        unique: true
    },
    picturePath: {
        type:String,
        default:[]
    },

})