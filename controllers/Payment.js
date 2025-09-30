import {instance} from "../config/razorpay.js";
import Course from "../models/Course.js";
import User from '../models/User.js';
import mailSender from "../utils/mailSender.js";
import {courseEnrollmentEmail} from '../mail/templates/courseEnrollmentEmail.js';
import mongoose from "mongoose";

const capturePayment = async(req ,res)=>{

     const {courseId} = req.body;
        const userId = req.user.id;

        if(!courseId ){
            return res.status(400).json({
                success:false,
                message:"Please Provide valid course"
            })
        }

    try{

        let course  =await Course.findById(courseId);
        if(!course){
            return res.status(400).json({
                success:false,
                message:"Course could not found"
            })
        }

        const uid = new mongoose.Schema.Types.ObjectId(userId);

        if(Course.studentEnrolled.include(uid)){
            return res.status(400).json({
                success:false,
                success:"Student Already Enrolled"
            })
        }


        }catch(err){
        return res.status(500).json({
            success:false,
            message:"Error while capture the payment",
            error:err.message
        })
    }
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount :amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId,
                userId
            }
        }
        

        try{
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);

            return res.status(200).json({
                success:true,
                courseName : course.courseName,
                courseDiscription : course.courseDiscription,
                thumbnail : course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount
             })

        }catch(err){
            return res.status(500).json({
                success:false,
                message:"Could not initiate order"
            })
        }
        
}   

const verifiedSignature = async(req,res)=>{
    const WebHookSecret = "123456789"
}

export default capturePayment;