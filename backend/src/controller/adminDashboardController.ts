import type { Request, Response } from "express";
import { AdminService } from "../service/adminDashboardService.js";
import { uploadToCloudinary } from "../utils/cloudinaryHelper.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const AdminController = {
    getProduct: asyncHandler(async (req: Request, res: Response) => {

        const product = await AdminService.getProduct();
        return res.status(200).json({
            success: true,
            message: "Succefully Retrieve Product",
            data: product
        });
    }),

    editData: asyncHandler(async (req: Request, res: Response) => {

        const id = Number(req.params.id);
        const { name, description} = req.body;
        const price = Number(req.body.price);
        const stock = Number(req.body.stock)

        let imageUrl;

        if(req.file){
            const upload = await uploadToCloudinary(req.file, "updated-folder");
            imageUrl = upload.url;
        }
        

        const product = await AdminService.editData( id, { name, description, price, ...(imageUrl && { imageUrl }), stock});
        return res.status(200).json({
            success: true,
            message: "updated Successfully",
            data: product
        });
    }),

    deleteData: asyncHandler(async ( req: Request, res: Response) => {
        const id = Number(req.params.id);

        await AdminService.deleteProduct(id);
        return res.status(200).json({
            success: true,
            message: "Successfullt Deleted",
            data: null
        });
    })
}