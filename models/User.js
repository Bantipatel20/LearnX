import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }],
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String
    },
    resetPasswordexpire:{
        type:Date
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ]
})

export default mongoose.model("User",userschema);