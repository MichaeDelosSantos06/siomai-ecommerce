import { prisma } from "../lib/prisma.js"


export const CartRepository = {
    // the cart.id is converted here as cartId.
    addToCart: async (cartId: number, productId: number) => {
        return prisma.cartItem.upsert({
            // look/find if the passed cart.id/cartId and productId is existing.
           where: {
              productId_cartId: {
                cartId,
                productId
              }
           },
           // if EXISTS, ONLY update the quantty increment by 1
           update: {
                quantity: {
                    increment: 1,
                }
           },
           // if NOT EXISTING create a new items with the passed cartId and productId with quantity of 1.
           create: {
                cartId,
                productId,
                quantity: 1
           },

           select:{
                id: true,
                quantity: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        imageUrl: true,
                    }
                }
           }
        });
    },

    // create a userId entity inside the CART table
    createCartItem: async (userId: number) => {
        return prisma.cart.create({
            data: { userId }
        });
    },

    // find/check userId inside the CART table
    findUserById: async (userId: number) => {
        return prisma.cart.findUnique({
            where: { userId }
        });
    },

    // Get/Read Cart Items
    getCartItem: async (userId: number) => {
        return prisma.cartItem.findMany({
            where: { 
                cart: {
                    userId
                }
            },
            select: {
                id: true,
                quantity: true,
                product: {
                    select: {
                        id: true,
                        imageUrl: true,
                        name: true,
                        description: true,
                        price: true,
                    }
                },

                cart: {
                    select: {
                        user: {
                            select:{
                                username: true
                            }
                        }
                    }
                }

            }
        });
    }

}