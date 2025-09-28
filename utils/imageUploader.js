import { v2 as cloudinary } from 'cloudinary'; 

const uploadImageToCloudinary = async(file ,folder , height , quality)=>{
    const option = {folder};

    if(height){
        option.height = height;
    }

    if(quality){
        option.quality =quality;
    }

    option.resourse_type = 'auto';

    return await cloudinary.uploader.upload(file.tempFilePath,option);
}


export default uploadImageToCloudinary;