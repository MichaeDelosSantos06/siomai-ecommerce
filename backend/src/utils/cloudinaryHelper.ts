import cloudinary from "../config/couldinary.js";
import { Readable } from "stream";

export const uploadToCloudinary = (
    file: Express.Multer.File,
    folder: string = "uploads"
): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        // ✅ NO streamifier needed
        Readable.from(file.buffer).pipe(stream);
    });
};