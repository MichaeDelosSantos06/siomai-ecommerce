import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { CartServices } from "../../../service/cartServices.js";
import { CartRepository } from "../../../repository/cartRepository.js";
import { ProductRepository } from "../../../repository/productRepository.js";
import { AppError } from "../../../utils/appError.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/cartRepository.js", () => ({
    CartRepository: {
        findUserById: vi.fn(),
        createCartItem: vi.fn(),
        addToCart: vi.fn(),
    },
}));

vi.mock("../../../repository/productRepository.js", () => ({
    ProductRepository: {
        checkStock: vi.fn(),
    },
}));

describe("CartServices.addToCart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const userId = 1;
    const productId = 5;

    const existingCart = { id: 10, userId: 1 };
    const newCart = { id: 20, userId: 1 };
    const productInStock = { id: 5, stock: 10 };
    const productOutOfStock = { id: 5, stock: 0 };
    const cartItemResult = {
        id: 1,
        quantity: 1,
        product: {
            id: 5,
            name: "Siomai",
            description: "Delicious steamed dumplings",
            price: 50,
            imageUrl: "https://example.com/siomai.jpg",
        },
    };

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should add product to cart when user has an existing cart and product is in stock", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(productInStock);
        (CartRepository.addToCart as Mock).mockResolvedValue(cartItemResult);

        const result = await CartServices.addToCart(userId, productId);

        expect(CartRepository.findUserById).toHaveBeenCalledWith(userId);
        expect(ProductRepository.checkStock).toHaveBeenCalledWith(productId);
        expect(CartRepository.addToCart).toHaveBeenCalledWith(existingCart.id, productId);
        expect(CartRepository.createCartItem).not.toHaveBeenCalled();
        expect(result).toEqual(cartItemResult);
    });

    it("should create a new cart for the user when no existing cart found, then add product", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(null);
        (CartRepository.createCartItem as Mock).mockResolvedValue(newCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(productInStock);
        (CartRepository.addToCart as Mock).mockResolvedValue(cartItemResult);

        const result = await CartServices.addToCart(userId, productId);

        expect(CartRepository.findUserById).toHaveBeenCalledWith(userId);
        expect(CartRepository.createCartItem).toHaveBeenCalledWith(userId);
        expect(ProductRepository.checkStock).toHaveBeenCalledWith(productId);
        expect(CartRepository.addToCart).toHaveBeenCalledWith(newCart.id, productId);
        expect(result).toEqual(cartItemResult);
    });

    it("should increment quantity when adding an existing product to cart", async () => {
        const incrementedResult = { ...cartItemResult, quantity: 2 };

        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(productInStock);
        (CartRepository.addToCart as Mock).mockResolvedValue(incrementedResult);

        const result = await CartServices.addToCart(userId, productId);

        expect(CartRepository.addToCart).toHaveBeenCalledWith(existingCart.id, productId);
        expect(result.quantity).toBe(2);
    });

    // =====================================================
    // FAILURE CASES - PRODUCT NOT AVAILABLE
    // =====================================================

    it("should throw AppError with message 'Product not available' when product does not exist", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(null);

        await expect(CartServices.addToCart(userId, productId)).rejects.toThrow(AppError);
        await expect(CartServices.addToCart(userId, productId)).rejects.toThrow("Product not available");

        expect(CartRepository.addToCart).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 400 when product does not exist", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(null);

        try {
            await CartServices.addToCart(userId, productId);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(400);
        }
    });

    // =====================================================
    // FAILURE CASES - OUT OF STOCK
    // =====================================================

    it("should throw AppError with message 'Out of stock' when product stock is 0", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(productOutOfStock);

        await expect(CartServices.addToCart(userId, productId)).rejects.toThrow(AppError);
        await expect(CartServices.addToCart(userId, productId)).rejects.toThrow("Out of stock");

        expect(CartRepository.addToCart).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 400 when product stock is 0", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(productOutOfStock);

        try {
            await CartServices.addToCart(userId, productId);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(400);
        }
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when findUserById repository throws", async () => {
        (CartRepository.findUserById as Mock).mockRejectedValue(
            new Error("Database connection failed")
        );

        await expect(CartServices.addToCart(userId, productId)).rejects.toThrow("Database connection failed");
        expect(CartRepository.createCartItem).not.toHaveBeenCalled();
        expect(ProductRepository.checkStock).not.toHaveBeenCalled();
        expect(CartRepository.addToCart).not.toHaveBeenCalled();
    });

    it("should propagate error when createCartItem repository throws", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(null);
        (CartRepository.createCartItem as Mock).mockRejectedValue(
            new Error("Create cart failed")
        );

        await expect(CartServices.addToCart(userId, productId)).rejects.toThrow("Create cart failed");
        expect(ProductRepository.checkStock).not.toHaveBeenCalled();
        expect(CartRepository.addToCart).not.toHaveBeenCalled();
    });

    it("should propagate error when checkStock repository throws", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockRejectedValue(
            new Error("Stock check failed")
        );

        await expect(CartServices.addToCart(userId, productId)).rejects.toThrow("Stock check failed");
        expect(CartRepository.addToCart).not.toHaveBeenCalled();
    });

    it("should propagate error when addToCart repository throws", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(productInStock);
        (CartRepository.addToCart as Mock).mockRejectedValue(
            new Error("Add to cart failed")
        );

        await expect(CartServices.addToCart(userId, productId)).rejects.toThrow("Add to cart failed");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle userId of 0", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(null);
        (CartRepository.createCartItem as Mock).mockResolvedValue({ id: 30, userId: 0 });
        (ProductRepository.checkStock as Mock).mockResolvedValue(productInStock);
        (CartRepository.addToCart as Mock).mockResolvedValue(cartItemResult);

        const result = await CartServices.addToCart(0, productId);

        expect(CartRepository.findUserById).toHaveBeenCalledWith(0);
        expect(CartRepository.createCartItem).toHaveBeenCalledWith(0);
        expect(result).toEqual(cartItemResult);
    });

    it("should handle negative productId", async () => {
        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(null);

        await expect(CartServices.addToCart(userId, -1)).rejects.toThrow("Product not available");
        expect(ProductRepository.checkStock).toHaveBeenCalledWith(-1);
    });

    it("should handle product with very large stock value", async () => {
        const highStockProduct = { id: 5, stock: 999999 };

        (CartRepository.findUserById as Mock).mockResolvedValue(existingCart);
        (ProductRepository.checkStock as Mock).mockResolvedValue(highStockProduct);
        (CartRepository.addToCart as Mock).mockResolvedValue(cartItemResult);

        const result = await CartServices.addToCart(userId, productId);

        expect(result).toEqual(cartItemResult);
    });
});