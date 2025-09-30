import mongoose from "mongoose";
import mailSender from '../utils/mailSender.js';

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

const sendVerificationEmail = async(email,otp)=>{
    try{
        const mailresponse = await mailSender(email,"Verificatin Email from LearnX",otp);
        console.log("Email Sending Successfully ",mailresponse);
    }catch(err){
        console.log("Error while sending the mail ",err);
        throw err;
    }
}

otpschema.pre("save",async function(next) {
    await sendVerificationEmail(this.email,this.otp);
    next();
})

export default mongoose.model("OTP",otpschema);