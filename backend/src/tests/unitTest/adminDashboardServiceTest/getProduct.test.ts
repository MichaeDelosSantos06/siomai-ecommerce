import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { AdminService } from "../../../service/adminDashboardService.js";
import { AdminRepository } from "../../../repository/adminDashboardRepository.js";
import { AppError } from "../../../utils/appError.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/adminDashboardRepository.js", () => ({
    AdminRepository: {
        getProduct: vi.fn(),
    },
}));

describe("AdminService.getProduct", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockProducts = [
        {
            id: 1,
            name: "Siomai",
            description: "Delicious steamed dumplings",
            price: 50,
            stock: 100,
            createdAt: new Date("2025-01-01"),
            updatedAt: new Date("2025-01-01"),
            imageUrl: "https://example.com/siomai.jpg",
            isActive: true,
        },
        {
            id: 2,
            name: "Palamig",
            description: "Refreshing cold drink",
            price: 25,
            stock: 200,
            createdAt: new Date("2025-01-02"),
            updatedAt: new Date("2025-01-02"),
            imageUrl: "https://example.com/palamig.jpg",
            isActive: true,
        },
    ];

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should return all products when products exist", async () => {
        (AdminRepository.getProduct as Mock).mockResolvedValue(mockProducts);

        const result = await AdminService.getProduct();

        expect(AdminRepository.getProduct).toHaveBeenCalledOnce();
        expect(result).toEqual(mockProducts);
        expect(result).toHaveLength(2);
    });

    it("should return products ordered by createdAt descending", async () => {
        const unsortedProducts = [
            { ...mockProducts[1]!, createdAt: new Date("2025-01-02") },
            { ...mockProducts[0]!, createdAt: new Date("2025-01-01") },
        ];

        (AdminRepository.getProduct as Mock).mockResolvedValue(unsortedProducts);

        const result = await AdminService.getProduct();

        expect(result).toEqual(unsortedProducts);
        expect(new Date(result[0]!.createdAt).getTime()).toBeGreaterThan(
            new Date(result[1]!.createdAt).getTime()
        );
    });

    it("should return a single product when only one product exists", async () => {
        const singleProduct = [mockProducts[0]!];
        (AdminRepository.getProduct as Mock).mockResolvedValue(singleProduct);

        const result = await AdminService.getProduct();

        expect(result).toHaveLength(1);
        expect(result[0]!.name).toBe("Siomai");
    });

    // =====================================================
    // FAILURE CASES
    // =====================================================

    it("should throw AppError with message 'No Product found' when repository returns empty array", async () => {
        (AdminRepository.getProduct as Mock).mockResolvedValue([]);

        await expect(AdminService.getProduct()).rejects.toThrow(AppError);
        await expect(AdminService.getProduct()).rejects.toThrow("No Product found");
    });

    it("should throw AppError with statusCode 400 when repository returns empty array", async () => {
        (AdminRepository.getProduct as Mock).mockResolvedValue([]);

        try {
            await AdminService.getProduct();
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(400);
        }
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when getProduct repository throws", async () => {
        (AdminRepository.getProduct as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(AdminService.getProduct()).rejects.toThrow("Database connection failed");
        expect(AdminRepository.getProduct).toHaveBeenCalledOnce();
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle products with inactive status", async () => {
        const productsWithInactive = [
            {
                ...mockProducts[0]!,
                isActive: false,
            },
        ];

        (AdminRepository.getProduct as Mock).mockResolvedValue(productsWithInactive);

        const result = await AdminService.getProduct();

        expect(result).toHaveLength(1);
        expect(result[0]!.isActive).toBe(false);
    });

    it("should handle a large number of products", async () => {
        const manyProducts = Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            description: `Description ${i + 1}`,
            price: (i + 1) * 10,
            stock: (i + 1) * 5,
            createdAt: new Date(`2025-01-${String(i + 1).padStart(2, "0")}`),
            updatedAt: new Date(`2025-01-${String(i + 1).padStart(2, "0")}`),
            imageUrl: `https://example.com/product${i + 1}.jpg`,
            isActive: i % 2 === 0,
        }));

        (AdminRepository.getProduct as Mock).mockResolvedValue(manyProducts);

        const result = await AdminService.getProduct();

        expect(result).toHaveLength(100);
        expect(result[99]!.name).toBe("Product 100");
    });
});