import type { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/appError.js";

export const authorize = (req: Request, res: Response, next: NextFunction ) => {
    if(req.user.role !== "ADMIN"){
        return next( new AppError("Accedd Denied: Anuthorized", 401));
    }

    next();
}