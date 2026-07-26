import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { ProductService } from "../../../service/productService.js";
import { ProductRepository } from "../../../repository/productRepository.js";
import { AppError } from "../../../utils/appError.js";
import type { CreateProductDTO, ProductResponseDTO } from "../../../types/productType.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/productRepository.js", () => ({
    ProductRepository: {
        checkExisingProduct: vi.fn(),
        addProduct: vi.fn(),
    },
}));

describe("ProductService.addProduct", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const validInput: CreateProductDTO = {
        name: "  Siomai  ",
        description: "Delicious steamed dumplings",
        price: 50,
        imageUrl: "https://example.com/siomai.jpg",
        stock: 100,
    };

    const expectedProductResponse: ProductResponseDTO = {
        id: 1,
        name: "siomai",
        description: "Delicious steamed dumplings",
        price: 50,
        imageUrl: "https://example.com/siomai.jpg",
        stock: 100,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
    };

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should create a new product successfully when product name does not exist", async () => {
        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockResolvedValue(expectedProductResponse);

        const result = await ProductService.addProduct(validInput);

        expect(ProductRepository.checkExisingProduct).toHaveBeenCalledWith("siomai");
        expect(ProductRepository.addProduct).toHaveBeenCalledWith({
            ...validInput,
            name: "siomai",
        });
        expect(result).toEqual(expectedProductResponse);
    });

    it("should normalize the product name to lowercase and trimmed before checking and saving", async () => {
        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockResolvedValue(expectedProductResponse);

        await ProductService.addProduct(validInput);

        expect(ProductRepository.checkExisingProduct).toHaveBeenCalledWith("siomai");
        expect(ProductRepository.addProduct).toHaveBeenCalledWith(
            expect.objectContaining({ name: "siomai" })
        );
    });

    it("should handle product name with only whitespace by normalizing to empty string", async () => {
        const whitespaceInput: CreateProductDTO = {
            ...validInput,
            name: "   ",
        };

        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockResolvedValue({
            ...expectedProductResponse,
            name: "",
        });

        const result = await ProductService.addProduct(whitespaceInput);

        expect(ProductRepository.checkExisingProduct).toHaveBeenCalledWith("");
        expect(ProductRepository.addProduct).toHaveBeenCalledWith(
            expect.objectContaining({ name: "" })
        );
        expect(result.name).toBe("");
    });

    it("should handle product name with mixed case and extra spaces", async () => {
        const mixedCaseInput: CreateProductDTO = {
            ...validInput,
            name: "   SIOMAI   ",
        };

        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockResolvedValue(expectedProductResponse);

        await ProductService.addProduct(mixedCaseInput);

        expect(ProductRepository.checkExisingProduct).toHaveBeenCalledWith("siomai");
        expect(ProductRepository.addProduct).toHaveBeenCalledWith(
            expect.objectContaining({ name: "siomai" })
        );
    });

    // =====================================================
    // FAILURE CASES - PRODUCT ALREADY EXISTS
    // =====================================================

    it("should throw AppError with message 'Product already exist' when product name already exists", async () => {
        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue({
            id: 1,
            name: "siomai",
        });

        await expect(ProductService.addProduct(validInput)).rejects.toThrow(AppError);
        await expect(ProductService.addProduct(validInput)).rejects.toThrow("Product already exist");

        expect(ProductRepository.addProduct).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 400 when product already exists", async () => {
        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue({
            id: 1,
            name: "siomai",
        });

        try {
            await ProductService.addProduct(validInput);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(400);
        }
    });

    it("should not call addProduct when product already exists", async () => {
        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue({
            id: 1,
            name: "siomai",
        });

        try {
            await ProductService.addProduct(validInput);
        } catch {
            // expected
        }

        expect(ProductRepository.addProduct).not.toHaveBeenCalled();
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when checkExisingProduct repository throws", async () => {
        (ProductRepository.checkExisingProduct as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(ProductService.addProduct(validInput)).rejects.toThrow("Database connection failed");
        expect(ProductRepository.addProduct).not.toHaveBeenCalled();
    });

    it("should propagate error when addProduct repository throws", async () => {
        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockRejectedValue(
            new Error("Insert failed")
        );

        await expect(ProductService.addProduct(validInput)).rejects.toThrow("Insert failed");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle product with zero price", async () => {
        const zeroPriceInput: CreateProductDTO = {
            ...validInput,
            price: 0,
        };

        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockResolvedValue({
            ...expectedProductResponse,
            price: 0,
        });

        const result = await ProductService.addProduct(zeroPriceInput);

        expect(ProductRepository.addProduct).toHaveBeenCalledWith(
            expect.objectContaining({ price: 0 })
        );
        expect(result.price).toBe(0);
    });

    it("should handle product with zero stock", async () => {
        const zeroStockInput: CreateProductDTO = {
            ...validInput,
            stock: 0,
        };

        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockResolvedValue({
            ...expectedProductResponse,
            stock: 0,
        });

        const result = await ProductService.addProduct(zeroStockInput);

        expect(ProductRepository.addProduct).toHaveBeenCalledWith(
            expect.objectContaining({ stock: 0 })
        );
        expect(result.stock).toBe(0);
    });

    it("should handle product with very long name", async () => {
        const longName = "a".repeat(255);
        const longNameInput: CreateProductDTO = {
            ...validInput,
            name: longName,
        };

        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockResolvedValue({
            ...expectedProductResponse,
            name: longName,
        });

        const result = await ProductService.addProduct(longNameInput);

        expect(ProductRepository.checkExisingProduct).toHaveBeenCalledWith(longName);
        expect(result.name).toBe(longName);
    });

    it("should handle product with negative price", async () => {
        const negativePriceInput: CreateProductDTO = {
            ...validInput,
            price: -100,
        };

        (ProductRepository.checkExisingProduct as Mock).mockResolvedValue(null);
        (ProductRepository.addProduct as Mock).mockResolvedValue({
            ...expectedProductResponse,
            price: -100,
        });

        const result = await ProductService.addProduct(negativePriceInput);

        expect(ProductRepository.addProduct).toHaveBeenCalledWith(
            expect.objectContaining({ price: -100 })
        );
        expect(result.price).toBe(-100);
    });
});