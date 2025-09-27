import mongoose from "mongoose";

const courseProgresSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completeVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ]
})

export default mongoose.model("CourseProgress",courseProgresSchema);