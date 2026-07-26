import { prisma } from "../lib/prisma.js";
import type { UpdateProductDTO } from "../types/productType.js";

export const AdminRepository = {
    getProduct: async () => {
        return prisma.product.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                createdAt: true,
                updatedAt: true,
                imageUrl: true,
                isActive: true,
            }
        });
    },

    editData: async ( id: number, data: UpdateProductDTO) => {
        return prisma.product.update({
            where: { id  },
            data 
        });
    },

    findProductById: async (productId: number) => {
        return prisma.product.findUnique({
            where: {
                id: productId
            }
        });
    },

    deleteProduct: async (id: number) => {
        return prisma.product.update({
            where: { id },
            data: {
                isActive: false
            }
        });
    }
}