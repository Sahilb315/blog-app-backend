import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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
