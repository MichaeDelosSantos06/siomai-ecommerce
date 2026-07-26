import { AdminRepository } from "../repository/adminDashboardRepository.js"
import type { UpdateProductDTO } from "../types/productType.js";
import { AppError } from "../utils/appError.js";


export const AdminService = {
    getProduct: async () => {

        const product = await AdminRepository.getProduct();
        if(product.length === 0){
            throw new AppError("No Product found", 400);
        }

        return product;
    },

    editData: async (id: number, data: UpdateProductDTO ) => {

        const findProduct = await AdminRepository.findProductById(id);
        if(!findProduct){
            throw new AppError("Product not found", 404);
        }

        const product = await AdminRepository.editData(id, data);
        if(!product){
            throw new AppError("Cannot update product", 400);
        }

        return product;
    },

    deleteProduct: async (id: number) => {

        const productId = await AdminRepository.findProductById(id);
        if(!productId){
            throw new AppError("Product not found", 404);
        }

        return AdminRepository.deleteProduct(id);
    }
}