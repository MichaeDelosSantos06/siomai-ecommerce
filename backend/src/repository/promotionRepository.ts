import { prisma } from "../lib/prisma.js";

export const PromotionRepository = {
    getBanner: async () => {
        return prisma.promotion.findFirst({
            where: {
                isActive: true
            },
           orderBy: {
                createdAt: "desc"
           },
           select: {
                id: true,
                imageUrl: true,
                titlePrefix: true,
                highlightedWord: true,
                description: true
           }
        });
    },

}