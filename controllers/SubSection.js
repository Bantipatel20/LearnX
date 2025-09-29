import SubSection from '../models/SubSection.js';
import Section from '../models/Section.js';
import uploadImageToCloudinary from '../utils/imageUploader.js';
import dotenv from 'dotenv';


dotenv.config();

const createSubSection  = async(req ,res)=>{
    try{
        const {sectionId,title,timeDuration,description} = req.body;
        const video = req.files.videoFile;

        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const videoUrl = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        const newSubSection = await SubSection.create({title,timeDuration,description,videoUrl});

        const updateSection = await Section.findByIdAndUpdate({sectionId},{
            $push:{
                SubSection:newSubSection._id
            }
        },{new:true}).populate("Instructor").exec();

        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            updateSection
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while creating the subsection",
            error:err.message
        })
    }
}


const updateSubSection = async(req,res)=>{
    try{
        const {updateValue} =req.body;

        const updateNewSubSection = await SubSection.findByIdAndUpdate({subSectionId} ,{updateValue},{new:true});

        return res.status(200).json({
            success:true,
            message:"SubSection updating successfully",
            updateNewSubSection
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while updatating subsection",
            error:err.message
        })
    }
} 


const deleteSubSection = async(req,res)=>{
    try{
        const {subSectionId , sectionId} = req.body;
        await SubSection.findByIdAndDelete(subSectionId);

     await Section.findByIdAndUpdate({_id:sectionId},{
        $pop:{
            subSection:subSectionId
        }
     },{new:true});

     return res.status(200).json({
        success:true,
        message:"SubSection Deleting successfully"
     })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while deleting the subsection",
            error:err.message
        })
    }
}


export { createSubSection, deleteSubSection, updateSubSection };