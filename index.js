import express from 'express';
import dotenv from 'dotenv';
import  connectDB  from './config/database.js';

dotenv.config();
const app = express();

// DB connection
connectDB();

// middlewares


// routes

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})

