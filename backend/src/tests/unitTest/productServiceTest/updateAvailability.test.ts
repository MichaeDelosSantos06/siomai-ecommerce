import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { ProductService } from "../../../service/productService.js";
import { ProductRepository } from "../../../repository/productRepository.js";
import { AppError } from "../../../utils/appError.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/productRepository.js", () => ({
    ProductRepository: {
        updateAvailability: vi.fn(),
    },
}));

describe("ProductService.updateAvailability", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should toggle product availability from active to inactive", async () => {
        const toggledProduct = {
            id: 1,
            name: "Siomai",
            isActive: false,
        };

        (ProductRepository.updateAvailability as Mock).mockResolvedValue(toggledProduct);

        const result = await ProductService.updateAvailability(1);

        expect(ProductRepository.updateAvailability).toHaveBeenCalledWith(1);
        expect(ProductRepository.updateAvailability).toHaveBeenCalledOnce();
        expect(result).toEqual(toggledProduct);
        expect(result.isActive).toBe(false);
    });

    it("should toggle product availability from inactive to active", async () => {
        const toggledProduct = {
            id: 2,
            name: "Palamig",
            isActive: true,
        };

        (ProductRepository.updateAvailability as Mock).mockResolvedValue(toggledProduct);

        const result = await ProductService.updateAvailability(2);

        expect(ProductRepository.updateAvailability).toHaveBeenCalledWith(2);
        expect(result).toEqual(toggledProduct);
        expect(result.isActive).toBe(true);
    });

    it("should return the full updated product object after toggling", async () => {
        const fullProduct = {
            id: 1,
            name: "Siomai",
            description: "Delicious steamed dumplings",
            price: 50,
            imageUrl: "https://example.com/siomai.jpg",
            stock: 100,
            isActive: false,
            createdAt: new Date("2025-01-01"),
            updatedAt: new Date("2025-01-01"),
        };

        (ProductRepository.updateAvailability as Mock).mockResolvedValue(fullProduct);

        const result = await ProductService.updateAvailability(1);

        expect(result).toEqual(fullProduct);
    });

    // =====================================================
    // FAILURE CASES
    // =====================================================

    it("should throw AppError with message 'Umable to change availability' when repository returns null", async () => {
        (ProductRepository.updateAvailability as Mock).mockResolvedValue(null);

        await expect(ProductService.updateAvailability(1)).rejects.toThrow(AppError);
        await expect(ProductService.updateAvailability(1)).rejects.toThrow("Umable to change availability");
    });

    it("should throw AppError with statusCode 500 when repository returns null", async () => {
        (ProductRepository.updateAvailability as Mock)
            .mockRejectedValue(new AppError("Product not found", 404));

        await expect(ProductService.updateAvailability(1))
            .rejects
            .toThrow("Product not found");
    });

    it("should throw AppError with message 'Umable to change availability' when repository returns undefined", async () => {
        (ProductRepository.updateAvailability as Mock).mockResolvedValue(undefined);

        await expect(ProductService.updateAvailability(1)).rejects.toThrow(AppError);
        await expect(ProductService.updateAvailability(1)).rejects.toThrow("Umable to change availability");
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when updateAvailability repository throws", async () => {
        (ProductRepository.updateAvailability as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(ProductService.updateAvailability(1)).rejects.toThrow("Database connection failed");
        expect(ProductRepository.updateAvailability).toHaveBeenCalledOnce();
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle product ID of 0", async () => {
        const toggledProduct = {
            id: 0,
            name: "Invalid",
            isActive: true,
        };

        (ProductRepository.updateAvailability as Mock).mockResolvedValue(toggledProduct);

        const result = await ProductService.updateAvailability(0);

        expect(ProductRepository.updateAvailability).toHaveBeenCalledWith(0);
        expect(result.id).toBe(0);
    });

    it("should handle negative product ID", async () => {
        const toggledProduct = {
            id: -1,
            name: "Negative",
            isActive: false,
        };

        (ProductRepository.updateAvailability as Mock).mockResolvedValue(toggledProduct);

        const result = await ProductService.updateAvailability(-1);

        expect(ProductRepository.updateAvailability).toHaveBeenCalledWith(-1);
        expect(result.id).toBe(-1);
    });

    it("should handle very large product ID", async () => {
        const largeId = 999999999;
        const toggledProduct = {
            id: largeId,
            name: "Large ID Product",
            isActive: true,
        };

        (ProductRepository.updateAvailability as Mock).mockResolvedValue(toggledProduct);

        const result = await ProductService.updateAvailability(largeId);

        expect(ProductRepository.updateAvailability).toHaveBeenCalledWith(largeId);
        expect(result.id).toBe(largeId);
    });
});