import mongoose from "mongoose";

const otpschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expire : 5*60,
    }
})

export default mongoose.model("OTP",otpschema);