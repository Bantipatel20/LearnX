import { json } from "express";
import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from 'bcrypt';
const resetPassewordToken = async(req ,res)=>{
    try{
        const {email} = req.body.email;

        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"Your email is not register"
            })
        }

        let token  = crypto.randomUUID();

        const updateUser = await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordexpire:Date.now()  + 5*60*1000
        },{new:true});
        

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email,"Password reset link",`Password reset link : ${url} `);

        return res.status(200).json({
            success:true,
            message:"Email Sent Successfully, Please check email and change password"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:'Error while sent reset password link'
        })
    }
}

const resetPassword = async(req,res)=>{
    try{
        const {password,confirmPassword,token} = req.body;
        if(!password||!confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword required"
            })
        }
         
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword not match"
            })
        }

        const userDetails = await User.findOne({token:token});

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Token is invalid"
            })
        }

        if(userDetails.resetPasswordexpire < Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token is expired, please regenerate is the token"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.findOneAndUpdate({token:token},
            {password:hashedPassword},
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reset the password"
        })
    }
}

export {resetPassewordToken,resetPassword};