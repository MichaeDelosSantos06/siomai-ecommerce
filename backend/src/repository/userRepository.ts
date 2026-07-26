import { prisma } from "../lib/prisma.js"
import type { RegisterUser, UserRegistrationDTO } from "../types/userType.js";
import type { GoogleUser } from "../types/googleLogin.inteface.js";

export const UserRepository = {
    register: async (data: UserRegistrationDTO): Promise<RegisterUser> => {

        return prisma.users.create({
            data: { ...data }
        });
    },

    

    checkEmail: async (email: string )=> {
        return prisma.users.findUnique({
            where: { email }
        });
    },

    checkUsername: async (username: string) => {
        return prisma.users.findUnique({
            where: { username}
        });
    },

    googleLogin: async (googleUser: GoogleUser) => {
        return prisma.users.upsert({
            where: { email: googleUser.email },
            update: {},
            create: {
                email: googleUser.email,
                username: googleUser.name,
                provider: "google",
                googleId: googleUser.sub,
                password: null
            },
        });
    },

    getCustomerInfo: async () => {
        return prisma.users.findMany({
            where: {
                    role: "USER"
                },
            select : {
                id: true,
                username: true,
                email: true,
                createdAT: true,
                status: true,
                order: {
                    select: {
                        id: true,
                        totalPrice: true,
                    }
                },
                addresses: {
                    select: {
                        street: true,
                        barangay: true,
                    }
                }
            }
        });
    },

    getTotalCustomer: async () => {
        return prisma.users.count({
            where: {
                role: "USER"
            }
        });
    },

    getTotalVipCustomer: async () => {
        return prisma.users.count({
            where: {
                role: "USER",
                status: "VIP"
            }
        });
    },

    newCustomers: async () => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return prisma.users.count({
            where: {
                role: "USER",
                createdAT: {
                    gte: startOfMonth,
                }
            }
        });
    }


  
}