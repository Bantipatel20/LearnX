import Course from '../models/Course.js';
import Section from '../models/Section.js';


const createSection = async(req ,res)=>{
    try{
        const {sectionName,courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const newSection = await Section.create({sectionName:sectionName});

        const updateCourse =  await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                courseContent:newSection._id
            }
        },{new:true}).populate("Instructor").exec();


        return res.status(200).json({
            success:true,
            message:"Section created Successfully",
            error:err.message
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error While create a section"
        })
    }
}


const updateSection = async(req,res)=>{
    try{
        const {newSectionName,sectionId} = req.body;

        if(!newSectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"New section name is required"
            })
        }

        const updateSection = await  Section.findByIdAndUpdate({_id:sectionId},{sectionName:newSectionName},{new:true});

        return res.status(200).json({
            success:true,
            message:"Section Update successfully"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error Updating the Section",
            error:err.message
        })
    }
}

const deleteSection = async(req,res)=>{
    try{
     const {sectionId,courseId} = req.params;
     await Section.findByIdAndDelete(sectionId);
     await Course.findByIdAndUpdate({_id:courseId},{
        $pop:{
            courseContent:sectionId
        }
     },{new:true});
     return res.success(200).json({
        success:true,
        message:"Section deleted Succeessfully"
     })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while Delete Section",
            error:err.message
        })
    }
}

export {createSection,updateSection,deleteSection};