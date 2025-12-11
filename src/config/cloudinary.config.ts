import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_SECRET_KEY,
});

export const deleteFromCloudinary = async (url: string) => {
  try {
    //https://res.cloudinary.com/dal6iqjfy/image/upload/v1765462973/my-passport-photojpg-1765462968124-c8zx3a8uow7.jpg;
    const publicId = url.split("/").pop()?.split(".")[0];
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.log("Failed to delete image from cloudinary", error);
  }
};

export const cloudinaryUpload = cloudinary;
