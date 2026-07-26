import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { ProductService } from "../../../service/productService.js";
import { ProductRepository } from "../../../repository/productRepository.js";
import { AppError } from "../../../utils/appError.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/productRepository.js", () => ({
    ProductRepository: {
        displayProduct: vi.fn(),
    },
}));

describe("ProductService.displayProduct", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockProducts = [
        {
            id: 1,
            name: "Siomai",
            description: "Delicious steamed dumplings",
            price: 50,
            imageUrl: "https://example.com/siomai.jpg",
        },
        {
            id: 2,
            name: "Palamig",
            description: "Refreshing cold drink",
            price: 25,
            imageUrl: "https://example.com/palamig.jpg",
        },
    ];

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should return all active products when products exist", async () => {
        (ProductRepository.displayProduct as Mock).mockResolvedValue(mockProducts);

        const result = await ProductService.displayProduct();

        expect(ProductRepository.displayProduct).toHaveBeenCalledOnce();
        expect(result).toEqual(mockProducts);
        expect(result).toHaveLength(2);
    });

    it("should return an empty array when no active products exist", async () => {
        (ProductRepository.displayProduct as Mock).mockResolvedValue([]);

        const result = await ProductService.displayProduct();

        expect(ProductRepository.displayProduct).toHaveBeenCalledOnce();
        expect(result).toEqual([]);
    });

    it("should return a single product when only one active product exists", async () => {
        const singleProduct = [mockProducts[0]!];
        (ProductRepository.displayProduct as Mock).mockResolvedValue(singleProduct);

        const result = await ProductService.displayProduct();

        expect(result).toHaveLength(1);
        expect(result[0]!.name).toBe("Siomai");
    });

    // =====================================================
    // FAILURE CASES
    // =====================================================

    it("should throw AppError with message 'No available Product' when repository returns null", async () => {
        (ProductRepository.displayProduct as Mock).mockResolvedValue(null);

        await expect(ProductService.displayProduct()).rejects.toThrow(AppError);
        await expect(ProductService.displayProduct()).rejects.toThrow("No available Product");
    });

    it("should throw AppError with statusCode 400 when repository returns null", async () => {
        (ProductRepository.displayProduct as Mock).mockResolvedValue(null);

        try {
            await ProductService.displayProduct();
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(400);
        }
    });

    it("should throw AppError with message 'No available Product' when repository returns undefined", async () => {
        (ProductRepository.displayProduct as Mock).mockResolvedValue(undefined);

        await expect(ProductService.displayProduct()).rejects.toThrow(AppError);
        await expect(ProductService.displayProduct()).rejects.toThrow("No available Product");
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when displayProduct repository throws", async () => {
        (ProductRepository.displayProduct as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(ProductService.displayProduct()).rejects.toThrow("Database connection failed");
        expect(ProductRepository.displayProduct).toHaveBeenCalledOnce();
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle products with missing optional fields", async () => {
        const productsWithNulls = [
            {
                id: 1,
                name: "Siomai",
                description: null,
                price: 50,
                imageUrl: null,
            },
        ];

        (ProductRepository.displayProduct as Mock).mockResolvedValue(productsWithNulls);

        const result = await ProductService.displayProduct();

        expect(result).toEqual(productsWithNulls);
        expect(result[0]!.description).toBeNull();
        expect(result[0]!.imageUrl).toBeNull();
    });

    it("should handle a large number of products", async () => {
        const manyProducts = Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            description: `Description ${i + 1}`,
            price: (i + 1) * 10,
            imageUrl: `https://example.com/product${i + 1}.jpg`,
        }));

        (ProductRepository.displayProduct as Mock).mockResolvedValue(manyProducts);

        const result = await ProductService.displayProduct();

        expect(result).toHaveLength(100);
        expect(result[99]!.name).toBe("Product 100");
    });
});