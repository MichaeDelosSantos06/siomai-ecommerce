import type { Request, Response } from "express";
import { PromotionService } from "../service/promotionService.js";

export const PromotionController = {
    getBanner: async (req: Request, res: Response) => {
        const banner = await PromotionService.getBanner();
        return res.status(200).json({
            success: true,
            message: "Active Banner Retrieve",
            data: banner
        });
    },

    // uploadBanner: async () => {

    // }
}