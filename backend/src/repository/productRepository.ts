import { prisma } from "../lib/prisma.js"
import type { CreateProductDTO, ProductResponseDTO } from "../types/productType.js";

export const ProductRepository = {
    addProduct: async (data: CreateProductDTO): Promise<ProductResponseDTO> => {
        return prisma.product.create({
            data: {
                ...data
            }
        });
    },

    checkExisingProduct: async (productName: string) => {
        return prisma.product.findUnique({
            where: { name: productName }
        });
    },

    displayProduct: async () => {
        return prisma.product.findMany({
            where: {
                isActive: true,
            },
            take: 4,
            select: {
                id: true,
                name: true, 
                description: true,
                price: true,
                imageUrl: true
            }
        });
    },

    displayMenuList: async () => {
        return prisma.product.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                name: true, 
                description: true,
                price: true,
                stock: true,
                imageUrl: true
            }
        });
    },

    addToCart: async (id: number) => {
        return prisma.product.findUnique({
            where: { id },
            select: {
                name: true,
                description: true,
                price: true,
                stock: true,
            }
        });
    },

    checkStock: async (id: number) => {
        return prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                stock: true
            }
        });
    },

    updateAvailability: async (id: number) => {
        const product = await prisma.product.findUnique({
            where: { id },
            select: { isActive: true }
        });

        return prisma.product.update({
            where: { id },
            data: {
                isActive: !product?.isActive
            }
        });
    }
}