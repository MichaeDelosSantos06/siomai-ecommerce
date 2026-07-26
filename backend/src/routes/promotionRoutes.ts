import { Router } from "express";
import { PromotionController } from "../controller/promotionController.js";

const router = Router();

router.get('/promotion/get-banner', PromotionController.getBanner);
// router.post('/promotion/add-banner');

export default router;