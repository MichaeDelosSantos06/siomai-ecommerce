import { ProductRepository } from "../repository/productRepository.js";
import type { CreateProductDTO } from "../types/productType.js";
import { AppError } from "../utils/appError.js";

export const ProductService = {
    addProduct: async (data: CreateProductDTO) => {

        const NormalizeName = data.name.toLowerCase().trim();

        const result = await ProductRepository.checkExisingProduct(NormalizeName)
        if(result){
            throw new AppError("Product already exist", 400);
        }

        const product = await ProductRepository.addProduct({
            ...data,
            name: NormalizeName
        });
        product.name = product.name.toLowerCase();
        return product;
    },

    displayProduct: async () => {

        const product = await ProductRepository.displayProduct();
        if(!product){
            throw new AppError("No available Product", 400);
        }
        return product;
    },

    updateAvailability: async (id: number ) => {
        const product = await ProductRepository.updateAvailability(id); 
        if(!product){
            throw new AppError("Umable to change availability", 404)
        }
        
        return product;
    },

    displayMenuList: async () => {
        const productList = await ProductRepository.displayMenuList();
        if(!productList || productList.length === 0){
            throw new AppError("No Available Products", 404);
        }
        
        return productList;
    }
    
}