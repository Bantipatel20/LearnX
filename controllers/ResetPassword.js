import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";

const resetPassewordToken = async(req ,res)=>{
    try{

    }catch(err){
        return res.status(500).json({
            success:false,
            message:''
        })
    }
}