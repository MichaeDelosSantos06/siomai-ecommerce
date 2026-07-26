import { Router } from "express";
import { UserController } from "../controller/userController.js";
import { RegisterInputValidation } from "../validation/regitserInputValidation.js";
import { LoginValidation } from "../validation/loginValidation.js";
import { tokenAuth } from "../middleware/verifyAuth.js";

const router = Router();

router.post('/user/register', RegisterInputValidation, UserController.register);
router.post('/user/login', LoginValidation, UserController.login);
router.post('/user/googleLogin', UserController.googleLogin);
router.get('/user/get-user-info', tokenAuth, UserController.getCustomerInfo);
router.get('/user/get-total-user', tokenAuth, UserController.getTotalCustomer);
router.get('/user/get-total-vip', tokenAuth, UserController.getTotalVipCustomer);
router.get('/user/get-total-new', tokenAuth, UserController.newCustomers);
export default router;