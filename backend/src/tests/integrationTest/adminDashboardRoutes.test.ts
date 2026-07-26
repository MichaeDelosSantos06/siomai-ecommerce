import "dotenv/config";
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import type { Express } from "express";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

// ------------------ MOCK EXTERNAL THIRD-PARTY SERVICES ONLY ------------------
vi.mock("../../config/couldinary.js", () => ({
    default: {
        uploader: {
            upload_stream: vi.fn(),
        },
    },
}));

// ------------------ IMPORTS ------------------

import adminRoutes from "../../routes/adminDashboardRoutes.js";
import { errorHandler } from "../../middleware/errorHandler.js";

// ------------------ TEST SETUP ------------------

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use("/api", adminRoutes);
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
            email: overrides.email ?? "dashboard-admin@test.com",
            username: overrides.username ?? "dashboard-admin",
            password: hashedPassword,
            role: overrides.role ?? "ADMIN",
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

describe("Admin Dashboard Routes - Integration Tests", () => {
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
    // GET /api/admin/get-data
    // =====================================================

    describe("GET /api/admin/get-data", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and list of products when authenticated as admin", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            await createProductInDb({ name: "product-1", price: 10, stock: 10, isActive: true });
            await createProductInDb({ name: "product-2", price: 10, stock: 10, isActive: true  });

            const response = await request(app)
                .get("/api/admin/get-data")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Succefully Retrieve Product");
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0]).toHaveProperty("name");
            expect(response.body.data[0]).toHaveProperty("price");
            expect(response.body.data[0]).toHaveProperty("stock");
            expect(response.body.data[0]).toHaveProperty("isActive");
        });

        it("should return products ordered by createdAt descending", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            await createProductInDb({ name: "older-product" });
            // Small delay to ensure different timestamps
            await new Promise((r) => setTimeout(r, 50));
            await createProductInDb({ name: "newer-product" });

            const response = await request(app)
                .get("/api/admin/get-data")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body.data[0].name).toBe("newer-product");
            expect(response.body.data[1].name).toBe("older-product");
        });

        // ==================== AUTHENTICATION FAILURES ====================

        it("should return 401 when no token is provided", async () => {
            const response = await request(app)
                .get("/api/admin/get-data")
                .expect(401);

            expect(response.body.message).toBe("No token found!");
        });

        it("should return 401 when token is invalid", async () => {
            const response = await request(app)
                .get("/api/admin/get-data")
                .set("Authorization", "Bearer invalid-token")
                .expect(401);

            expect(response.body.message).toBe("Unauthorized");
        });

        // ==================== AUTHORIZATION FAILURES ====================

        it("should return 401 when user is not an admin", async () => {
            const user = await createUserInDb({ role: "USER" });
            const token = generateAuthToken(user);

            const response = await request(app)
                .get("/api/admin/get-data")
                .set("Authorization", `Bearer ${token}`)
                .expect(401);

            expect(response.body.message).toBe("Accedd Denied: Anuthorized");
        });

        // ==================== RESOURCE NOT FOUND ====================

        it("should return 400 when no products exist", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);

            const response = await request(app)
                .get("/api/admin/get-data")
                .set("Authorization", `Bearer ${token}`)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("No Product found");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            const spy = vi.spyOn(prisma.product, "findMany").mockRejectedValueOnce(new Error("Database query failed"));

            const response = await request(app)
                .get("/api/admin/get-data")
                .set("Authorization", `Bearer ${token}`)
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // PUT /api/admin/edit-product/:id
    // =====================================================

    describe("PUT /api/admin/edit-product/:id", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and update product details when authenticated as admin", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            const product = await createProductInDb({ name: "original-name", description: "Updated description", price: 100, stock: 10 });

            const response = await request(app)
                .put(`/api/admin/edit-product/${product.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "updated-name", description: "Updated description", price: 200, stock: 20 })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("updated Successfully");
            expect(response.body.data.name).toBe("updated-name");
            expect(response.body.data.price).toBe(200);
            expect(response.body.data.stock).toBe(20);

            // Verify database state
            const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
            expect(updatedProduct!.name).toBe("updated-name");
            expect(updatedProduct!.price).toBe(200);
            expect(updatedProduct!.stock).toBe(20);
        });

        it("should update product fields correctly", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            const product = await createProductInDb({ name: "update-test", price: 100, stock: 10 });

            const response = await request(app)
                .put(`/api/admin/edit-product/${product.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "updated-name", price: 200, stock: 20, description: "Updated" })
                .expect(200);

            expect(response.body.data.name).toBe("updated-name");
            expect(response.body.data.price).toBe(200);
            expect(response.body.data.stock).toBe(20);
            expect(response.body.data.description).toBe("Updated");
        });

        // ==================== AUTHENTICATION FAILURES ====================

        it("should return 401 when no token is provided", async () => {
            const product = await createProductInDb();

            const response = await request(app)
                .put(`/api/admin/edit-product/${product.id}`)
                .send({ name: "updated" })
                .expect(401);

            expect(response.body.message).toBe("No token found!");
        });

        // ==================== AUTHORIZATION FAILURES ====================

        it("should return 401 when user is not an admin", async () => {
            const user = await createUserInDb({ role: "USER" });
            const token = generateAuthToken(user);
            const product = await createProductInDb();

            const response = await request(app)
                .put(`/api/admin/edit-product/${product.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "updated" })
                .expect(401);

            expect(response.body.message).toBe("Accedd Denied: Anuthorized");
        });

        // ==================== RESOURCE NOT FOUND ====================

        it("should return 404 when product does not exist", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);

            const response = await request(app)
                .put("/api/admin/edit-product/99999")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "updated" })
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Product not found");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            const product = await createProductInDb();
            const spy = vi.spyOn(prisma.product, "update").mockRejectedValueOnce(new Error("Database update failed"));

            const response = await request(app)
                .put(`/api/admin/edit-product/${product.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "updated" })
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // PUT /api/admin/delete-product/:id
    // =====================================================

    describe("PUT /api/admin/delete-product/:id", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and soft-delete the product (set isActive to false)", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            const product = await createProductInDb({ name: "to-delete", isActive: true });

            const response = await request(app)
                .put(`/api/admin/delete-product/${product.id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Successfullt Deleted");

            // Verify database state - product should be soft-deleted
            const deletedProduct = await prisma.product.findUnique({ where: { id: product.id } });
            expect(deletedProduct).not.toBeNull();
            expect(deletedProduct!.isActive).toBe(false);
        });

        // ==================== AUTHENTICATION FAILURES ====================

        it("should return 401 when no token is provided", async () => {
            const product = await createProductInDb();

            const response = await request(app)
                .put(`/api/admin/delete-product/${product.id}`)
                .expect(401);

            expect(response.body.message).toBe("No token found!");
        });

        // ==================== AUTHORIZATION FAILURES ====================

        it("should return 401 when user is not an admin", async () => {
            const user = await createUserInDb({ role: "USER" });
            const token = generateAuthToken(user);
            const product = await createProductInDb();

            const response = await request(app)
                .put(`/api/admin/delete-product/${product.id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(401);

            expect(response.body.message).toBe("Accedd Denied: Anuthorized");
        });

        // ==================== RESOURCE NOT FOUND ====================

        it("should return 404 when product does not exist", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);

            const response = await request(app)
                .put("/api/admin/delete-product/99999")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Product not found");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            const product = await createProductInDb();
            const spy = vi.spyOn(prisma.product, "update").mockRejectedValueOnce(new Error("Database update failed"));

            const response = await request(app)
                .put(`/api/admin/delete-product/${product.id}`)
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
        it("should return 404 for an unknown route under /api/admin", async () => {
            const response = await request(app)
                .get("/api/admin/nonexistent-route")
                .expect(404);

            expect(response.body).toBeDefined();
        });
    });
});