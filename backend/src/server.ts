import dotenv from "dotenv";
dotenv.config();


import express from "express";
const app = express();

const PORT = process.env.BACKEND_PORT || 8000;


import helmet from "helmet";
import cors from "cors";
import ratelimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import UserRoute from "./routes/userRoutes.js";
import ProductRoute from "./routes/productRoute.js"
import CartRoute from "./routes/cartRoutes.js";
import Promotion from "./routes/promotionRoutes.js"
import AdminRoute from "./routes/adminDashboardRoutes.js";

app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_PORT,
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT"]
    })
);
app.use(
    ratelimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        message: {
            success: false,
            message: "Too many requests, try again later."
        }
    })
)
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Inventory Backend is running 🚀",
  });
});
app.use('/api', UserRoute);
app.use('/api', ProductRoute);
app.use('/api', CartRoute);
app.use('/api', Promotion);
app.use('/api', AdminRoute);
app.use(errorHandler);





app.listen(PORT, () => {
    console.log(`Serve start listening to PORT ${PORT}`);
});








// helmet
//cors
//ratelimit
//json.express
//errorHandler