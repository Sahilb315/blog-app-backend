import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: "sahil9181",
  //   api_key: process.env.CLOUDINARY_KEY,
  api_key: "317486947752343",
  api_secret: "NSMj1dc6odHKsKnAdMF_BH-5wMY",
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
