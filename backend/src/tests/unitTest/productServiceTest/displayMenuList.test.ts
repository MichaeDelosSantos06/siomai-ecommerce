import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { ProductService } from "../../../service/productService.js";
import { ProductRepository } from "../../../repository/productRepository.js";
import { AppError } from "../../../utils/appError.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/productRepository.js", () => ({
    ProductRepository: {
        displayMenuList: vi.fn(),
    },
}));

describe("ProductService.displayMenuList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockMenuList = [
        {
            id: 1,
            name: "Siomai",
            description: "Delicious steamed dumplings",
            price: 50,
            stock: 100,
            imageUrl: "https://example.com/siomai.jpg",
        },
        {
            id: 2,
            name: "Palamig",
            description: "Refreshing cold drink",
            price: 25,
            stock: 200,
            imageUrl: "https://example.com/palamig.jpg",
        },
    ];

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should return the menu list when active products exist", async () => {
        (ProductRepository.displayMenuList as Mock).mockResolvedValue(mockMenuList);

        const result = await ProductService.displayMenuList();

        expect(ProductRepository.displayMenuList).toHaveBeenCalledOnce();
        expect(result).toEqual(mockMenuList);
        expect(result).toHaveLength(2);
    });

    it("should throw AppError with message 'No Available Products' when repository returns empty array", async () => {
        (ProductRepository.displayMenuList as Mock).mockResolvedValue([]);

        await expect(ProductService.displayMenuList()).rejects.toThrow(AppError);
        await expect(ProductService.displayMenuList()).rejects.toThrow("No Available Products");
    });

    it("should return a single product in the menu list", async () => {
        const singleProduct = [mockMenuList[0]!];
        (ProductRepository.displayMenuList as Mock).mockResolvedValue(singleProduct);

        const result = await ProductService.displayMenuList();

        expect(result).toHaveLength(1);
        expect(result[0]!.name).toBe("Siomai");
        expect(result[0]!.stock).toBe(100);
    });

    // =====================================================
    // FAILURE CASES
    // =====================================================

    it("should throw AppError with message 'No Available Products' when repository returns null", async () => {
        (ProductRepository.displayMenuList as Mock).mockResolvedValue(null);

        await expect(ProductService.displayMenuList()).rejects.toThrow(AppError);
        await expect(ProductService.displayMenuList()).rejects.toThrow("No Available Products");
    });

    it("should throw AppError with statusCode 404 when repository returns null", async () => {
        (ProductRepository.displayMenuList as Mock).mockResolvedValue(null);

        try {
            await ProductService.displayMenuList();
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(404);
        }
    });

    it("should throw AppError with message 'No Available Products' when repository returns undefined", async () => {
        (ProductRepository.displayMenuList as Mock).mockResolvedValue(undefined);

        await expect(ProductService.displayMenuList()).rejects.toThrow(AppError);
        await expect(ProductService.displayMenuList()).rejects.toThrow("No Available Products");
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when displayMenuList repository throws", async () => {
        (ProductRepository.displayMenuList as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(ProductService.displayMenuList()).rejects.toThrow("Database connection failed");
        expect(ProductRepository.displayMenuList).toHaveBeenCalledOnce();
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle products with zero stock in the menu list", async () => {
        const zeroStockProducts = [
            {
                id: 1,
                name: "Out of Stock Item",
                description: "No stock available",
                price: 50,
                stock: 0,
                imageUrl: "https://example.com/outofstock.jpg",
            },
        ];

        (ProductRepository.displayMenuList as Mock).mockResolvedValue(zeroStockProducts);

        const result = await ProductService.displayMenuList();

        expect(result).toHaveLength(1);
        expect(result[0]!.stock).toBe(0);
    });

    it("should handle products with missing optional fields in menu list", async () => {
        const productsWithNulls = [
            {
                id: 1,
                name: "Siomai",
                description: null,
                price: 50,
                stock: 100,
                imageUrl: null,
            },
        ];

        (ProductRepository.displayMenuList as Mock).mockResolvedValue(productsWithNulls);

        const result = await ProductService.displayMenuList();

        expect(result).toEqual(productsWithNulls);
        expect(result[0]!.description).toBeNull();
        expect(result[0]!.imageUrl).toBeNull();
    });

    it("should handle a large menu list", async () => {
        const manyProducts = Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            description: `Description ${i + 1}`,
            price: (i + 1) * 10,
            stock: (i + 1) * 5,
            imageUrl: `https://example.com/product${i + 1}.jpg`,
        }));

        (ProductRepository.displayMenuList as Mock).mockResolvedValue(manyProducts);

        const result = await ProductService.displayMenuList();

        expect(result).toHaveLength(100);
        expect(result[99]!.name).toBe("Product 100");
        expect(result[99]!.stock).toBe(500);
    });
});