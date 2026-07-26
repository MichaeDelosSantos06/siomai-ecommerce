import type { Request, Response, NextFunction} from "express";
import { AppError } from "../utils/appError.js";

// Pass the next function to the controller
export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (process.env.NODE_ENV !== "test") {
        console.error(err);
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};