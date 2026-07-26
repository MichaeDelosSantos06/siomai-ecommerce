import { CartRepository } from "../repository/cartRepository.js";
import { ProductRepository } from "../repository/productRepository.js"
import { AppError } from "../utils/appError.js";


export const CartServices = {
    addToCart: async (userId: number, productId: number) => {

        // check if there is an existing userId inside cart table (the userId of user being logged in)
        let cart = await CartRepository.findUserById(userId);

        // if NO existing, it will create, tthe value will depends in the user being pass or id of the logged in user.
        if(!cart){
            cart = await CartRepository.createCartItem(userId);
        }

        // check if there is an existing ITEMS/PRODUCT with "this id" (the product id that the user will pass).
       const product = await ProductRepository.checkStock(productId);

       // if NO throw an error.
       if(!product){
            throw new AppError("Product not available", 400);
       }
       

       // check the stock entity stock inside product table and check if the stock is enough or out of stock
       // if NOT enough throw an error. 
       if(product.stock === 0){
            throw new AppError("Out of stock", 400);
       }

       // if all the validatin being passed it will call the addToCart function then pass the id of cart table and the product id
       return CartRepository.addToCart(cart.id, productId);
       
    },

    getCartItem: async (userId: number) => {

        const user = await CartRepository.findUserById(userId);
        if(!user){
            throw new AppError("Id not found", 404);
        }

        return CartRepository.getCartItem(userId);
    }
}