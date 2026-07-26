import { Router } from "express";
import { CartControllers } from "../controller/cartControllers.js";
import { tokenAuth } from "../middleware/verifyAuth.js";

const router = Router();

router.post('/cart/add-to-cart', tokenAuth, CartControllers.addToCart);
router.get('/cart/get-cart-item', tokenAuth, CartControllers.getCartItem);

export default router;