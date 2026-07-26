import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { CartServices } from "../../../service/cartServices.js";
import { CartRepository } from "../../../repository/cartRepository.js";
import { AppError } from "../../../utils/appError.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/cartRepository.js", () => ({
    CartRepository: {
        findUserById: vi.fn(),
        getCartItem: vi.fn(),
    },
}));

describe("CartServices.getCartItem", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const userId = 1;

    const existingUser = { id: 10, userId: 1 };

    const mockCartItems = [
        {
            id: 1,
            quantity: 2,
            product: {
                id: 5,
                imageUrl: "https://example.com/siomai.jpg",
                name: "Siomai",
                description: "Delicious steamed dumplings",
                price: 50,
            },
            cart: {
                user: {
                    username: "john",
                },
            },
        },
        {
            id: 2,
            quantity: 1,
            product: {
                id: 6,
                imageUrl: "https://example.com/palamig.jpg",
                name: "Palamig",
                description: "Refreshing cold drink",
                price: 25,
            },
            cart: {
                user: {
                    username: "john",
                },
            },
        },
    ];

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should return cart items when user exists and has items in cart", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingUser);
        (CartRepository.getCartItem as Mock).mockResolvedValue(mockCartItems);

        const result = await CartServices.getCartItem(userId);

        expect(CartRepository.findUserById).toHaveBeenCalledWith(userId);
        expect(CartRepository.getCartItem).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockCartItems);
        expect(result).toHaveLength(2);
    });

    it("should return an empty array when user exists but cart is empty", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingUser);
        (CartRepository.getCartItem as Mock).mockResolvedValue([]);

        const result = await CartServices.getCartItem(userId);

        expect(CartRepository.findUserById).toHaveBeenCalledWith(userId);
        expect(CartRepository.getCartItem).toHaveBeenCalledWith(userId);
        expect(result).toEqual([]);
    });

    it("should return a single cart item when user has only one item", async () => {
        const singleItem = [mockCartItems[0]!];

        (CartRepository.findUserById as Mock).mockResolvedValue(existingUser);
        (CartRepository.getCartItem as Mock).mockResolvedValue(singleItem);

        const result = await CartServices.getCartItem(userId);

        expect(result).toHaveLength(1);
        expect(result[0]!.product.name).toBe("Siomai");
        expect(result[0]!.quantity).toBe(2);
    });

    // =====================================================
    // FAILURE CASES - USER NOT FOUND
    // =====================================================

    it("should throw AppError with message 'Id not found' when user does not exist", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(null);

        await expect(CartServices.getCartItem(userId)).rejects.toThrow(AppError);
        await expect(CartServices.getCartItem(userId)).rejects.toThrow("Id not found");

        expect(CartRepository.getCartItem).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 404 when user does not exist", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(null);

        try {
            await CartServices.getCartItem(userId);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(404);
        }
    });

    it("should throw AppError with message 'Id not found' when findUserById returns undefined", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(undefined);

        await expect(CartServices.getCartItem(userId)).rejects.toThrow(AppError);
        await expect(CartServices.getCartItem(userId)).rejects.toThrow("Id not found");

        expect(CartRepository.getCartItem).not.toHaveBeenCalled();
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when findUserById repository throws", async () => {
        (CartRepository.findUserById as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(CartServices.getCartItem(userId)).rejects.toThrow("Database connection failed");
        expect(CartRepository.getCartItem).not.toHaveBeenCalled();
    });

    it("should propagate error when getCartItem repository throws", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingUser);
        (CartRepository.getCartItem as Mock).mockRejectedValue(
            new Error("Fetch cart items failed")
        );

        await expect(CartServices.getCartItem(userId)).rejects.toThrow("Fetch cart items failed");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle userId of 0", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(null);

        await expect(CartServices.getCartItem(0)).rejects.toThrow("Id not found");
        expect(CartRepository.findUserById).toHaveBeenCalledWith(0);
    });

    it("should handle negative userId", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(null);

        await expect(CartServices.getCartItem(-1)).rejects.toThrow("Id not found");
        expect(CartRepository.findUserById).toHaveBeenCalledWith(-1);
    });

    it("should handle cart items with large quantities", async () => {
        const largeQuantityItems = [
            {
                ...mockCartItems[0]!,
                quantity: 999,
            },
        ];

        (CartRepository.findUserById as Mock).mockResolvedValue(existingUser);
        (CartRepository.getCartItem as Mock).mockResolvedValue(largeQuantityItems);

        const result = await CartServices.getCartItem(userId);

        expect(result).toHaveLength(1);
        expect(result[0]!.quantity).toBe(999);
    });
});