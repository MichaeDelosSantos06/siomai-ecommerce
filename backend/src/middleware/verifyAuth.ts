import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js"; 

export const tokenAuth = (req: Request, res: Response, next: NextFunction) => {
    try{
        const headerAuth = req.headers.authorization;

        if(!headerAuth){
            return res.status(401).json({
                message: 'No token found!'
            });
        }

        const token = headerAuth.split(" ")[1];

        if(!token){
            return res.status(400).json({
                message: 'Invalid token format!'
            });
        }

        const decoded = verifyToken(token);

        if(!decoded){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        req.user = decoded;

        next();
    }catch(error){
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}

/**
 *  This code block chesck appy to the route that need a permission to acces
 *  its basically check if there is a token or access pass to continue 
 */