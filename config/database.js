import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = ()=>{
    mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => {
        console.error("Error While Database Connection:", err);
        process.exit(1);
    });
}

export default connectDB;