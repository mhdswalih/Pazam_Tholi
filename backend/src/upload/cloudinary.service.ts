import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "Profile_Pic_PazamTholi", 
                },
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                },
            );

            uploadStream.end(file.buffer);
        });
    }
}