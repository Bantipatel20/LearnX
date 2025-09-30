import mongoose, { mongo } from "mongoose";
import Course from "./Course";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    Course:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ]
})

export default mongoose.model("Category",categorySchema);
