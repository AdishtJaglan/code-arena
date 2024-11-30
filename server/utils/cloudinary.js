import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../config/env-config.js";
import fs from "fs";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    fs.unlinkSync(filePath);
  }
};

export default uploadImageToCloudinary;
