import type { Request, Response, NextFunction } from "express";
import { UserService } from "../service/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const UserController = {
    register: asyncHandler(async (req: Request, res: Response) => {

        const {email, username, password} = req.body;
        await UserService.register({email, username, password});
        return res.status(201).json({
            success: true,
            message: "Successfully Registered"
        })
        
    }),

    login: async (req: Request, res: Response, next: NextFunction) => {
        const {email, password} = req.body;
        try{
            const user = await UserService.login({email, password});
            return res.status(200).json({
                success: true,
                message: "Successfully Login",
                data: user
            });

        }catch(error){
            next(error);
        }
    },

    googleLogin: asyncHandler(async (req: Request, res: Response) => {
        const { accessToken } = req.body;
        const { user, token } = await UserService.googleLogin({ accessToken });
        return res.status(200).json({
            success: true,
            message: "Successfully Logged In",
            user,
            token
        });
    }),

    getCustomerInfo: asyncHandler(async (req: Request, res: Response) => {
        const customerInfo = await UserService.getCustomerInfo();

        return res.status(200).json({
            success: true,
            message: "Successfully Retrieve Customer Info",
            data: customerInfo
        });
    }),

    getTotalCustomer: async (req: Request, res: Response) => {
        const customer = await UserService.getTotalCustomer();

        return res.status(200).json({
            success: true,
            message: "Successfully Retrieve Customer",
            data: customer
        });
    },

    newCustomers: async (req: Request, res: Response) => {
        const newCustomer = await UserService.newCustomers();

        return res.status(200).json({
            success: true,
            message: "Successfully Retrieve New Customer",
            data: newCustomer
        });
    },

    getTotalVipCustomer: async (req: Request, res: Response) => {
        const vipCustomer = await UserService.getTotalVipCustomer();

        return res.status(200).json({
            success: true,
            message: "Successfully Retrieve VIP Customer",
            data: vipCustomer
        });
    }
}