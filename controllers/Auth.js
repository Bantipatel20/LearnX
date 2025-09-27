import User from '../models/User.js';
import OTP from '../models/OTP.js';
import otpgenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import Profile from '../models/Profile.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { use } from 'react';
import { json } from 'express';

dotenv.config();

const sendOTP = async(req ,res)=>{
    try{
        const {email} = req.body;

        const checkUserAccount  = await User.findOne({email});

        if(checkUserAccount){
            return res.status(401).json({
                success:false,
                message:"User Already Registered"
            })
        }

        let otp = otpgenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        let result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpgenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            })
            result = await OTP.findOne({otp:otp});
        }

        const otppayload = {email,otp};
        
        const otpBody = await OTP.create(otppayload);

        res.status(200).json({
            success:true,
            message:"otp sent successfully",
            otp,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            status:false,
            message:err.message
        })
    }
}

const signup = async(req,res)=>{
    try{
        const {email,firstName,lastName,password,confirmPassword,accountType,contactNumber,otp} = req.body;

        if(!email || !firstName || !lastName || !password || !confirmPassword || !accountType){
            return res.status(403).json({
                success:false,
                message:"All fields are Required"
            })
        }

        if(password!==confirmPassword){
            return res.status(400).json({
                status:false,
                message:"Password and ConfirmPassword value does not match, Please try again"
            })
        }

        const checkUserAccount  = await User.findOne({email});

        if(checkUserAccount){
            return res.status(401).json({
                success:false,
                message:"User Already Registered"
            })
        }

        const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);

        if(recentOTP.length ==0){
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }else if(otp!==recentOTP.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const profileDetails = await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null});
        const user = await User.create({email,
            firstName,
            lastName,
            contactNumber,
            accountType,
            password:hashedPassword,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });

        return res.status(200).json({
            status:true,
            message:"User registered successfully",
            user
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            status:false,
            message:"User can't be registered, please try again"
        })
    }
}

const login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                status:false,
                message:"Email and Password is required"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                status:false,
                message:"User not found"
            })
        }

        if(await bcrypt.compare(user.password,password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })

            user.token = token;
            user.password = undefined;
            const option = {
                expiresIn:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,option).json({
                success:true,
                message:"Logged in Successfully",
                token,
                user,
            })
        }else{
            return res.status(401).json({
                success:true,
                message:'Password is incorrect'
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            status:false,
            message:"Erro While user Login"
        })
    }
}

// const changePassword = async(req,res)=>{
//     try{
//         const {olpPassword , newPassword , confirmPassword} = req.body;

//         if(!olpPassword || !newPassword || !confirmPassword){
//             return res.status(400).json({
//                 status:false,
//                 message:"All fields are required"
//             })
//         }else if(newPassword!==confirmPassword){
//             return res.status(400).json({
//                 status:false,
//                 message:"newPassword and ConfirmPassword value does not match, Please try again"
//             })
//         }
//         const use
//         if(await bcrypt.compare())
//     }catch(err){

//     }
// }

export { sendOTP, signup ,login};