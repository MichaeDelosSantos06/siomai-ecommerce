import { Router } from "express";
import { AdminController } from "../controller/adminDashboardController.js";
import { tokenAuth } from "../middleware/verifyAuth.js";
import { authorize } from "../middleware/authorize.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get('/admin/get-data', tokenAuth, authorize,  AdminController.getProduct);
router.put('/admin/edit-product/:id', upload.single("image"), tokenAuth, authorize, AdminController.editData);
router.put('/admin/delete-product/:id', tokenAuth, authorize, AdminController.deleteData);

export default router;  