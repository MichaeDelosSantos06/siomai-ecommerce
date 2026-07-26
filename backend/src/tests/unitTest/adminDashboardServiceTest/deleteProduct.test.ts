import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { AdminService } from "../../../service/adminDashboardService.js";
import { AdminRepository } from "../../../repository/adminDashboardRepository.js";
import { AppError } from "../../../utils/appError.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/adminDashboardRepository.js", () => ({
    AdminRepository: {
        findProductById: vi.fn(),
        deleteProduct: vi.fn(),
    },
}));

describe("AdminService.deleteProduct", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const existingProduct = {
        id: 1,
        name: "Siomai",
        description: "Delicious steamed dumplings",
        price: 50,
        stock: 100,
        imageUrl: "https://example.com/siomai.jpg",
        isActive: true,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
    };

    const deletedProduct = {
        ...existingProduct,
        isActive: false,
    };

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should delete a product successfully when product exists", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.deleteProduct as Mock).mockResolvedValue(deletedProduct);

        const result = await AdminService.deleteProduct(1);

        expect(AdminRepository.findProductById).toHaveBeenCalledWith(1);
        expect(AdminRepository.deleteProduct).toHaveBeenCalledWith(1);
        expect(result).toEqual(deletedProduct);
        expect(result.isActive).toBe(false);
    });

    it("should set isActive to false after deletion", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.deleteProduct as Mock).mockResolvedValue(deletedProduct);

        const result = await AdminService.deleteProduct(1);

        expect(result.isActive).toBe(false);
    });

    // =====================================================
    // FAILURE CASES - PRODUCT NOT FOUND
    // =====================================================

    it("should throw AppError with message 'Product not found' when product does not exist", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        await expect(AdminService.deleteProduct(1)).rejects.toThrow(AppError);
        await expect(AdminService.deleteProduct(1)).rejects.toThrow("Product not found");

        expect(AdminRepository.deleteProduct).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 404 when product does not exist", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        try {
            await AdminService.deleteProduct(1);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(404);
        }
    });

    it("should not call deleteProduct when product is not found", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        try {
            await AdminService.deleteProduct(1);
        } catch {
            // expected
        }

        expect(AdminRepository.deleteProduct).not.toHaveBeenCalled();
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when findProductById repository throws", async () => {
        (AdminRepository.findProductById as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(AdminService.deleteProduct(1)).rejects.toThrow("Database connection failed");
        expect(AdminRepository.deleteProduct).not.toHaveBeenCalled();
    });

    it("should propagate error when deleteProduct repository throws", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.deleteProduct as Mock).mockRejectedValue(
            new Error("Delete failed")
        );

        await expect(AdminService.deleteProduct(1)).rejects.toThrow("Delete failed");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle product ID of 0", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        await expect(AdminService.deleteProduct(0)).rejects.toThrow("Product not found");
        expect(AdminRepository.findProductById).toHaveBeenCalledWith(0);
    });

    it("should handle negative product ID", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        await expect(AdminService.deleteProduct(-1)).rejects.toThrow("Product not found");
        expect(AdminRepository.findProductById).toHaveBeenCalledWith(-1);
    });

    it("should handle very large product ID", async () => {
        const largeId = 999999999;

        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.deleteProduct as Mock).mockResolvedValue({
            ...deletedProduct,
            id: largeId,
        });

        const result = await AdminService.deleteProduct(largeId);

        expect(AdminRepository.findProductById).toHaveBeenCalledWith(largeId);
        expect(AdminRepository.deleteProduct).toHaveBeenCalledWith(largeId);
        expect(result.id).toBe(largeId);
    });
});