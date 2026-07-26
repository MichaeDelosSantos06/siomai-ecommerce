import { AppError } from "./appError.js";

export function assertFile(
    file: Express.Multer.File | undefined
): asserts file is Express.Multer.File {
    if (!file) {
        throw new AppError("File is required", 400);
    }
}