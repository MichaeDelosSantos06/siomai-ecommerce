import "dotenv/config";
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import type { Express } from "express";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

// ------------------ MOCKS (none needed - no external services) ------------------

// ------------------ IMPORTS ------------------

import cartRoutes from "../../routes/cartRoutes.js";
import { errorHandler } from "../../middleware/errorHandler.js";

// ------------------ TEST SETUP ------------------

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use("/api", cartRoutes);
    app.use(errorHandler);
    return app;
};

// ==================== HELPERS ====================

const createUserInDb = async (overrides: Partial<{
    email: string;
    username: string;
    password: string;
    role: "USER" | "ADMIN";
    status: "VIP" | "REGULAR" | "NEW";
}> = {}) => {
    const hashedPassword = await bcrypt.hash(overrides.password ?? "Password1", 12);
    return prisma.users.create({
        data: {
            email: overrides.email ?? "user@test.com",
            username: overrides.username ?? "testuser",
            password: hashedPassword,
            role: overrides.role ?? "USER",
            status: overrides.status ?? "NEW",
        },
    });
};

const createProductInDb = async (overrides: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    isActive: boolean;
}> = {}) => {
    return prisma.product.create({
        data: {
            name: overrides.name ?? "test-product",
            description: overrides.description ?? "A test product",
            price: overrides.price ?? 100,
            stock: overrides.stock ?? 10,
            imageUrl: overrides.imageUrl ?? "http://example.com/image.jpg",
            isActive: overrides.isActive ?? true,
        },
    });
};

const generateAuthToken = (user: { id: number; email: string; username: string; role: string; status: string }) => {
    return generateToken({
        id: user.id,
        role: user.role,
        status: user.status,
        username: user.username,
        email: user.email,
    });
};

// ==================== TEST SUITE ====================

describe("Cart Routes - Integration Tests", () => {
    let app: Express;

    beforeAll(async () => {
        app = createTestApp();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.cartItem.deleteMany();
        await prisma.cart.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.orders.deleteMany();
        await prisma.address.deleteMany();
        await prisma.product.deleteMany();
        await prisma.promotion.deleteMany();
        await prisma.users.deleteMany();
        vi.clearAllMocks();
    });

    // =====================================================
    // POST /api/cart/add-to-cart
    // =====================================================

    describe("POST /api/cart/add-to-cart", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and add a product to cart when authenticated", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);
            const product = await createProductInDb({ name: "pizza", stock: 5 });

            const response = await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product.id })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Added to Cart");
            expect(response.body.data).toHaveProperty("quantity", 1);
            expect(response.body.data.product.name).toBe("pizza");

            // Verify database state - cart and cartItem should exist
            const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
            expect(cart).not.toBeNull();
            const cartItem = await prisma.cartItem.findFirst({
                where: { cartId: cart!.id, productId: product.id },
            });
            expect(cartItem).not.toBeNull();
            expect(cartItem!.quantity).toBe(1);
        });

        it("should increment quantity when the same product is added again", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);
            const product = await createProductInDb({ name: "pizza", stock: 5 });

            // First add
            await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product.id })
                .expect(200);

            // Second add - should increment quantity
            const response = await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product.id })
                .expect(200);

            expect(response.body.data.quantity).toBe(2);

            // Verify database state
            const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
            const cartItem = await prisma.cartItem.findFirst({
                where: { cartId: cart!.id, productId: product.id },
            });
            expect(cartItem!.quantity).toBe(2);
        });

        it("should create a new cart for the user if one does not exist", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);
            const product = await createProductInDb({ name: "burger", stock: 5 });

            // Verify no cart exists yet
            let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
            expect(cart).toBeNull();

            await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product.id })
                .expect(200);

            // Verify cart was created
            cart = await prisma.cart.findUnique({ where: { userId: user.id } });
            expect(cart).not.toBeNull();
        });

        // ==================== AUTHENTICATION FAILURES ====================

        it("should return 401 when no token is provided", async () => {
            const product = await createProductInDb();

            const response = await request(app)
                .post("/api/cart/add-to-cart")
                .send({ productId: product.id })
                .expect(401);

            expect(response.body.message).toBe("No token found!");
        });

        it("should return 401 when token is invalid", async () => {
            const response = await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", "Bearer invalid-token")
                .send({ productId: 1 })
                .expect(401);

            expect(response.body.message).toBe("Unauthorized");
        });

        // ==================== BUSINESS RULE VIOLATIONS ====================

        it("should return 400 when product does not exist", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);

            const response = await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: 99999 })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Product not available");
        });

        it("should return 400 when product is out of stock", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);
            const product = await createProductInDb({ name: "out-of-stock-item", stock: 0 });

            const response = await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product.id })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Out of stock");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);
            const product = await createProductInDb();
            const spy = vi.spyOn(prisma.cart, "findUnique").mockRejectedValueOnce(new Error("Database query failed"));

            const response = await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product.id })
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // GET /api/cart/get-cart-item
    // =====================================================

    describe("GET /api/cart/get-cart-item", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and cart items when authenticated", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);
            const product = await createProductInDb({ name: "sushi", stock: 5 });

            // Add item to cart first
            await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product.id })
                .expect(200);

            const response = await request(app)
                .get("/api/cart/get-cart-item")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Succesffully read");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].product.name).toBe("sushi");
            expect(response.body.data[0].quantity).toBe(1);
            expect(response.body.data[0].cart.user.username).toBe(user.username);
        });

        it("should return multiple cart items", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);
            const product1 = await createProductInDb({ name: "sushi", stock: 5 });
            const product2 = await createProductInDb({ name: "ramen", stock: 5 });

            await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product1.id })
                .expect(200);

            await request(app)
                .post("/api/cart/add-to-cart")
                .set("Authorization", `Bearer ${token}`)
                .send({ productId: product2.id })
                .expect(200);

            const response = await request(app)
                .get("/api/cart/get-cart-item")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body.data).toHaveLength(2);
        });

        // ==================== AUTHENTICATION FAILURES ====================

        it("should return 401 when no token is provided", async () => {
            const response = await request(app)
                .get("/api/cart/get-cart-item")
                .expect(401);

            expect(response.body.message).toBe("No token found!");
        });

        // ==================== RESOURCE NOT FOUND ====================

        it("should return 404 when user has no cart", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);

            const response = await request(app)
                .get("/api/cart/get-cart-item")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Id not found");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const user = await createUserInDb();
            const token = generateAuthToken(user);
            const spy = vi.spyOn(prisma.cart, "findUnique").mockRejectedValueOnce(new Error("Database query failed"));

            const response = await request(app)
                .get("/api/cart/get-cart-item")
                .set("Authorization", `Bearer ${token}`)
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // 404 - UNKNOWN ROUTE
    // =====================================================

    describe("Unknown Routes", () => {
        it("should return 404 for an unknown route under /api/cart", async () => {
            const response = await request(app)
                .get("/api/cart/nonexistent-route")
                .expect(404);

            expect(response.body).toBeDefined();
        });
    });
});