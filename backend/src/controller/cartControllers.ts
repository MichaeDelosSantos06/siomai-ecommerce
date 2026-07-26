import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CartServices } from "../service/cartServices.js";

export const CartControllers = {
    addToCart: asyncHandler(async (req: Request, res: Response) => {
        // it get the current id of the user that use this function (the logged in user)
        const userId = req.user.id;

        // the productId of the prodduct that user being selected will pass to the req.body.
        const { productId } = req.body

        // caling thr addToCart function then pass the userId and prodcutId.
        const result = await CartServices.addToCart(userId, productId);
        return res.status(200).json({
            success: true,
            message: "Added to Cart",
            data: result
        });
    }),

    getCartItem: asyncHandler( async (req: Request, res: Response) => {

        const userId = req.user.id;
        const result = await CartServices.getCartItem(userId);
        return res.status(200).json({
            success: true,
            message: "Succesffully read",
            data: result
        });
    })
}