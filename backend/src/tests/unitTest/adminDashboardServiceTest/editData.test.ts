import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { AdminService } from "../../../service/adminDashboardService.js";
import { AdminRepository } from "../../../repository/adminDashboardRepository.js";
import { AppError } from "../../../utils/appError.js";
import type { UpdateProductDTO } from "../../../types/productType.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/adminDashboardRepository.js", () => ({
    AdminRepository: {
        findProductById: vi.fn(),
        editData: vi.fn(),
    },
}));

describe("AdminService.editData", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const validId = 1;

    const updatePayload: UpdateProductDTO = {
        name: "Updated Siomai",
        price: 60,
    };

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

    const updatedProduct = {
        ...existingProduct,
        ...updatePayload,
        updatedAt: new Date("2025-01-02"),
    };

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should update a product successfully when product exists and data is valid", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockResolvedValue(updatedProduct);

        const result = await AdminService.editData(validId, updatePayload);

        expect(AdminRepository.findProductById).toHaveBeenCalledWith(validId);
        expect(AdminRepository.editData).toHaveBeenCalledWith(validId, updatePayload);
        expect(result).toEqual(updatedProduct);
        expect(result.name).toBe("Updated Siomai");
        expect(result.price).toBe(60);
    });

    it("should update product with partial data (single field)", async () => {
        const partialUpdate: UpdateProductDTO = { price: 75 };

        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockResolvedValue({
            ...existingProduct,
            price: 75,
            updatedAt: new Date("2025-01-02"),
        });

        const result = await AdminService.editData(validId, partialUpdate);

        expect(AdminRepository.editData).toHaveBeenCalledWith(validId, { price: 75 });
        expect(result.price).toBe(75);
        expect(result.name).toBe("Siomai"); // unchanged
    });

    it("should update product with all fields", async () => {
        const fullUpdate: UpdateProductDTO = {
            name: "New Name",
            description: "New description",
            price: 999,
            imageUrl: "https://example.com/new.jpg",
            stock: 500,
        };

        const fullyUpdated = {
            ...existingProduct,
            ...fullUpdate,
            updatedAt: new Date("2025-01-02"),
        };

        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockResolvedValue(fullyUpdated);

        const result = await AdminService.editData(validId, fullUpdate);

        expect(AdminRepository.editData).toHaveBeenCalledWith(validId, fullUpdate);
        expect(result).toEqual(fullyUpdated);
    });

    // =====================================================
    // FAILURE CASES - PRODUCT NOT FOUND
    // =====================================================

    it("should throw AppError with message 'Product not found' when product does not exist", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        await expect(AdminService.editData(validId, updatePayload)).rejects.toThrow(AppError);
        await expect(AdminService.editData(validId, updatePayload)).rejects.toThrow("Product not found");

        expect(AdminRepository.editData).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 404 when product does not exist", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        try {
            await AdminService.editData(validId, updatePayload);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(404);
        }
    });

    // =====================================================
    // FAILURE CASES - CANNOT UPDATE
    // =====================================================

    it("should throw AppError with message 'Cannot update product' when editData repository returns null", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockResolvedValue(null);

        await expect(AdminService.editData(validId, updatePayload)).rejects.toThrow(AppError);
        await expect(AdminService.editData(validId, updatePayload)).rejects.toThrow("Cannot update product");
    });

    it("should throw AppError with statusCode 400 when editData repository returns null", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockResolvedValue(null);

        try {
            await AdminService.editData(validId, updatePayload);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(400);
        }
    });

    it("should throw AppError with message 'Cannot update product' when editData returns undefined", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockResolvedValue(undefined);

        await expect(AdminService.editData(validId, updatePayload)).rejects.toThrow(AppError);
        await expect(AdminService.editData(validId, updatePayload)).rejects.toThrow("Cannot update product");
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when findProductById repository throws", async () => {
        (AdminRepository.findProductById as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(AdminService.editData(validId, updatePayload)).rejects.toThrow("Database connection failed");
        expect(AdminRepository.editData).not.toHaveBeenCalled();
    });

    it("should propagate error when editData repository throws", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockRejectedValue(
            new Error("Update failed")
        );

        await expect(AdminService.editData(validId, updatePayload)).rejects.toThrow("Update failed");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle product ID of 0", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        await expect(AdminService.editData(0, updatePayload)).rejects.toThrow("Product not found");
        expect(AdminRepository.findProductById).toHaveBeenCalledWith(0);
    });

    it("should handle negative product ID", async () => {
        (AdminRepository.findProductById as Mock).mockResolvedValue(null);

        await expect(AdminService.editData(-1, updatePayload)).rejects.toThrow("Product not found");
        expect(AdminRepository.findProductById).toHaveBeenCalledWith(-1);
    });

    it("should handle updating with empty payload", async () => {
        const emptyPayload: UpdateProductDTO = {};

        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockResolvedValue(existingProduct);

        const result = await AdminService.editData(validId, emptyPayload);

        expect(AdminRepository.editData).toHaveBeenCalledWith(validId, {});
        expect(result).toEqual(existingProduct);
    });

    it("should handle updating price to zero", async () => {
        const zeroPriceUpdate: UpdateProductDTO = { price: 0 };

        (AdminRepository.findProductById as Mock).mockResolvedValue(existingProduct);
        (AdminRepository.editData as Mock).mockResolvedValue({
            ...existingProduct,
            price: 0,
        });

        const result = await AdminService.editData(validId, zeroPriceUpdate);

        expect(result.price).toBe(0);
    });
});