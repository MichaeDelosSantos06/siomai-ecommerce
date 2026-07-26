import { PromotionRepository } from "../repository/promotionRepository.js"
import { AppError } from "../utils/appError.js";


export const PromotionService = {
    getBanner: async () => {

        const banner = await PromotionRepository.getBanner();
        if(!banner){
            throw new AppError("No active banner", 404);
        }

        return banner;
    },

    // uploadBanner: async () => {

    // }
}