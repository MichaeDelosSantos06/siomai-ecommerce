import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProductService } from "../service/productService.js";
import { uploadToCloudinary } from "../utils/cloudinaryHelper.js";
import { assertFile } from "../utils/assertFile.js";

export const ProductControler = {
    addProduct: asyncHandler( async (req: Request, res: Response) => {

        const {name, description, price, stock} = req.body;
        const file = req.file;

        assertFile(file);
        const uploadResult = await uploadToCloudinary(file, "products"); 

        const result = await ProductService.addProduct({name, description, price, stock, imageUrl: uploadResult.url});
        return res.status(201).json({
            success: true,
            message: `${result.name} Successfully Added`
        });
    }),

    displayProduct: asyncHandler(async (req: Request, res: Response) => {

        const result = await ProductService.displayProduct();
        return res.status(200).json({
            success: true,
            message: "Product Successsfully Retrieve",
            data: result
        })
    }),

    updateAvailability: asyncHandler( async (req: Request, res: Response) => {

        const id = Number(req.params.id);

        await ProductService.updateAvailability(id);
        return res.status(200).json({
            success: true,
            message: "Succesfully Updated"
        });
    }),

    displayMenuList: asyncHandler (async (req: Request, res: Response) => {
        const result = await ProductService.displayMenuList();
        return res.status(200).json({
            success: true,
            messgae: "Product List Successfully Retrieve",
            data: result
        });
    })
}