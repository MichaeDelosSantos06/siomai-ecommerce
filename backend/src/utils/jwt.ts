import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "1d"});
}

export const verifyToken = (token: string) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET!);
    }catch(error){
        console.error("ERROR FROM JWT:", error);
        return null;
    }
}