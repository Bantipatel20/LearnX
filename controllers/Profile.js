import Profile from '../models/Profile.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
const updateProfile = async(req ,res)=>{
    try{
        const {gender,dateOfBirth='',contactNumber,about=''} = req.body;

        const id = req.user.id;

        if(!id || !gender || !contactNumber ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const userDetails = await User.findById(id);

        const profileId = userDetails.additionalDetails;

        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
         
        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails,
        })
        
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while updating the profile ",
            error:err.message
        })
    }
}

const deleteProfile = async(req,res)=>{
    try{
      
        const id = req.user.id;
        const userDetails = await User.findById(id);

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //remove enrolled from the all the courses
        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while deleting the profile",
            error:err.message
        })
    }
}

const getAllUserDetails = async(req,res)=>{
    try{
        const userDetails = (await User.find(req.user.id).populate("additionalDetails")).exec();

        return res.status(200).json({
            success:true,
            message:"Successfully fetch User Details",
            userDetails
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while fetch the user details",
            error:err.message
        })
    }
}
export { updateProfile, deleteProfile, getAllUserDetails};