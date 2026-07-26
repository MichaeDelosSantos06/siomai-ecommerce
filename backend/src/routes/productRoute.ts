import { Router } from "express";
import { ProductControler } from "../controller/productController.js";
import { ValidateProduct } from "../validation/createProductVaidation.js";
import { authorize } from "../middleware/authorize.js";
import { tokenAuth } from "../middleware/verifyAuth.js";
import upload from "../middleware/multer.js";


const router = Router();

router.post('/product/addProduct', upload.single("image"), tokenAuth, authorize, ValidateProduct, ProductControler.addProduct);
router.get('/product/trending', ProductControler.displayProduct);
router.put('/product/change-availability/:id', ProductControler.updateAvailability);
router.get('/product/product-list', ProductControler.displayMenuList);

export default router;