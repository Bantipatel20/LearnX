import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = async(req,req,next)=>{
    try{
        const token = req.cookie.token || req.body.token || req.header("Authorisation").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                status:false,
                message:"Token is missing"
            })
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode
        }catch(err){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while validating the token"
        })
    }
}

const isStudent = async(req,res,next)=>{
    try{
        if(req.user.accontType!=='Student'){
            return res.status(401).json({
                success:false,
                message:"This is protected route for the student"
            })
        }
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
        })
    }
}

const isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accontType!=='Instructor'){
            return res.status(401).json({
                success:false,
                message:"This is protected route for the Instructor"
            })
        }
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
        })
    }
}


const isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accontType!=='Admin'){
            return res.status(401).json({
                success:false,
                message:"This is protected route for the Admin",
            })
        }
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        })
    }
}

export {auth,isAdmin,isStudent,isInstructor};

