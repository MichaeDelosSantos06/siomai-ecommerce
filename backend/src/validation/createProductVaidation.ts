import type{ Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { CreateProductSchema } from "../schemas/product.schema.js";

   export const ValidateProduct = (req: Request, res: Response, next: NextFunction) => {

      const result = CreateProductSchema.safeParse(req.body);

      if(!result.success){
         const message = result.error.issues[0]?.message ?? "Invalid request";
         
         return next(new AppError(message, 400))
      }

      req.body = result.data;
      next();
   }   

