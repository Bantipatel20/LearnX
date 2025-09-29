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


    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while creating the subsection"
        })
    }
}