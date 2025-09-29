import { memo } from 'react';
import Course from '../models/Course.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import uploadImageToCloudinary from '../utils/imageUploader.js';
import dotenv from 'dotenv';

dotenv.config();

const createCourse = async(req ,res)=>{
    try{
        const {courseName,courseDescription ,whatYouWillLearn,tag, price}= req.body;

        const thumbnail  = req.files.thumbnailImage;

        if(!courseDescription || !courseName || !whatYouWillLearn || !price || !thumbnail || !tag ){
            return res.status(400).json({
                success:false,
                message:"All fields is required"
            })
        }

        const userid  = req.user.id;

        const instructorDetail = await User.findById(userid);

        if(!instructorDetail){
            return res.status(404).json({
                success:false,
                message:"Instructor not found"
            })
        }

        const tagDetails = await Tag.findById(tag);

        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag not found"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        const newcourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetail._id,
            price,
            whatYouWillLearn,
            tag:tagDetails._id,
            thumbnail:thumbnailImage
        })
 
        await User.findByIdAndUpdate({_id:instructorDetail._id},{
            $push:{
                courses:newcourse._id
            }
        },{new:true});

        await Tag.findByIdAndUpdate({_id:tagDetails._id},{course:newcourse._id},{new:true});

        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newcourse
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })  
    }
}

const getAllCourses = async(req,res)=>{
    try{
        const allCourse = await Course.find({});

        return res.status(200).json({
            success:true,
            message:"All course Successfully fetch",
            data:allCourse
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

export { createCourse , getAllCourses };


