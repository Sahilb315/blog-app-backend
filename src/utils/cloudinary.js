import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUDINARY_KEY, CLOUDINARY_SECRET_KEY } from "../utils/config.js";

cloudinary.config({
  cloud_name: "sahil9181",
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    if (result.url) {
      fs.unlinkSync(localFilePath);
      return result;
    } else {
      return null;
    }
  } catch (error) {
    // removes the locally saved temporary file
    console.log("Error in uploading image on cloudinary: ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
