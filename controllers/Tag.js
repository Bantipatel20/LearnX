import { json } from 'express';
import Tag from '../models/Tag.js';

const createTag = async(req ,res)=>{
    try{
        const {name ,description} = req.body;

        if(!name , !description){
            return res.status(400),json({
                success:false,
                message:"All fields are required"
            })
        }

        const tagDetails = await  Tag.create({name:name,description:description});

        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

const showAllTags = async(req,res)=>{
    try{
        const  allTags = await Tag.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message:"All tags successfully",
            allTags
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


export { showAllTags , createTag };