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

import productRoutes from "../../routes/productRoute.js";
import { errorHandler } from "../../middleware/errorHandler.js";

// ------------------ TEST SETUP ------------------

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use("/api", productRoutes);
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
            email: overrides.email ?? "product-admin@test.com",
            username: overrides.username ?? "product-admin",
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

describe("Product Routes - Integration Tests", () => {
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
    // POST /api/product/addProduct
    // =====================================================

    describe("POST /api/product/addProduct", () => {
        // ==================== SUCCESS ====================

        it("should return 201 and create a new product when authenticated as admin", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);

            // Mock Cloudinary upload
            const cloudinary = await import("../../config/couldinary.js");
            (cloudinary.default.uploader.upload_stream as ReturnType<typeof vi.fn>).mockImplementation(
                (_options: unknown, callback: (error: null, result: { secure_url: string; public_id: string }) => void) => {
                    callback(null, { secure_url: "http://cloudinary.com/image.jpg", public_id: "products/test" });
                    return { pipe: vi.fn() };
                }
            );

            const response = await request(app)
                .post("/api/product/addProduct")
                .set("Authorization", `Bearer ${token}`)
                .attach("image", Buffer.from("fake-image-data"), "test.jpg")
                .field("name", "New Pizza")
                .field("description", "Delicious pizza")
                .field("price", "250")
                .field("stock", "20")
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain("Successfully Added");

            // Verify database state
            const product = await prisma.product.findUnique({ where: { name: "new pizza" } });
            expect(product).not.toBeNull();
            expect(product!.price).toBe(250);
            expect(product!.stock).toBe(20);
            expect(product!.isActive).toBe(true);
        });

        // ==================== VALIDATION ERRORS ====================

        it("should return 400 when name is too short", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);

            const response = await request(app)
                .post("/api/product/addProduct")
                .set("Authorization", `Bearer ${token}`)
                .attach("image", Buffer.from("fake-image-data"), "test.jpg")
                .field("name", "ab")
                .field("description", "Short name product")
                .field("price", "100")
                .field("stock", "10")
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("name must be atleast");
        });

        it("should return 400 when price is not a positive number", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);

            const response = await request(app)
                .post("/api/product/addProduct")
                .set("Authorization", `Bearer ${token}`)
                .attach("image", Buffer.from("fake-image-data"), "test.jpg")
                .field("name", "Valid Name")
                .field("description", "Description")
                .field("price", "-50")
                .field("stock", "10")
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should return 400 when stock is invalid", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);

            const response = await request(app)
                .post("/api/product/addProduct")
                .set("Authorization", `Bearer ${token}`)
                .attach("image", Buffer.from("fake-image-data"), "test.jpg")
                .field("name", "Valid Name")
                .field("description", "Description")
                .field("price", "100")
                .field("stock", "-5")
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it("should return 400 when no image file is provided", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);

            const response = await request(app)
                .post("/api/product/addProduct")
                .set("Authorization", `Bearer ${token}`)
                .field("name", "Valid Name")
                .field("description", "Description")
                .field("price", "100")
                .field("stock", "10")
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("File is required");
        });

        // ==================== AUTHENTICATION FAILURES ====================

        it("should return 401 when no token is provided", async () => {
            const response = await request(app)
                .post("/api/product/addProduct")
                .expect(401);

            expect(response.body.message).toBe("No token found!");
        });

        // ==================== AUTHORIZATION FAILURES ====================

        it("should return 401 when user is not an admin", async () => {
            const user = await createUserInDb({ role: "USER" });
            const token = generateAuthToken(user);

            const response = await request(app)
                .post("/api/product/addProduct")
                .set("Authorization", `Bearer ${token}`)
                .attach("image", Buffer.from("fake-image-data"), "test.jpg")
                .field("name", "Valid Name")
                .field("description", "Description")
                .field("price", "100")
                .field("stock", "10")
                .expect(401);

            expect(response.body.message).toBe("Accedd Denied: Anuthorized");
        });

        // ==================== BUSINESS RULE VIOLATIONS ====================

        it("should return 400 when product name already exists", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            await createProductInDb({ name: "existing-product" });

            const cloudinary = await import("../../config/couldinary.js");
            (cloudinary.default.uploader.upload_stream as ReturnType<typeof vi.fn>).mockImplementation(
                (_options: unknown, callback: (error: null, result: { secure_url: string; public_id: string }) => void) => {
                    callback(null, { secure_url: "http://cloudinary.com/image.jpg", public_id: "products/test" });
                    return { pipe: vi.fn() };
                }
            );

            const response = await request(app)
                .post("/api/product/addProduct")
                .set("Authorization", `Bearer ${token}`)
                .attach("image", Buffer.from("fake-image-data"), "test.jpg")
                .field("name", "existing-product")
                .field("description", "Duplicate product")
                .field("price", "100")
                .field("stock", "10")
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Product already exist");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const admin = await createUserInDb();
            const token = generateAuthToken(admin);
            const spy = vi.spyOn(prisma.product, "create").mockRejectedValueOnce(new Error("Database insert failed"));

            const cloudinary = await import("../../config/couldinary.js");
            (cloudinary.default.uploader.upload_stream as ReturnType<typeof vi.fn>).mockImplementation(
                (_options: unknown, callback: (error: null, result: { secure_url: string; public_id: string }) => void) => {
                    callback(null, { secure_url: "http://cloudinary.com/image.jpg", public_id: "products/test" });
                    return { pipe: vi.fn() };
                }
            );

            const response = await request(app)
                .post("/api/product/addProduct")
                .set("Authorization", `Bearer ${token}`)
                .attach("image", Buffer.from("fake-image-data"), "test.jpg")
                .field("name", "New Product")
                .field("description", "Description")
                .field("price", "100")
                .field("stock", "10")
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // GET /api/product/trending
    // =====================================================

    describe("GET /api/product/trending", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and list of active products (max 4)", async () => {
            await createProductInDb({ name: "product-1", isActive: true });
            await createProductInDb({ name: "product-2", isActive: true });
            await createProductInDb({ name: "product-3", isActive: true });
            await createProductInDb({ name: "product-4", isActive: true });
            await createProductInDb({ name: "product-5", isActive: true });

            const response = await request(app)
                .get("/api/product/trending")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Product Successsfully Retrieve");
            expect(Array.isArray(response.body.data)).toBe(true);
            // Should return at most 4 products
            expect(response.body.data.length).toBeLessThanOrEqual(4);
            expect(response.body.data[0]).toHaveProperty("name");
            expect(response.body.data[0]).toHaveProperty("price");
            expect(response.body.data[0]).toHaveProperty("imageUrl");
        });

        it("should return only active products (not inactive ones)", async () => {
            await createProductInDb({ name: "active-product", isActive: true });
            await createProductInDb({ name: "inactive-product", isActive: false });

            const response = await request(app)
                .get("/api/product/trending")
                .expect(200);

            const names = response.body.data.map((p: { name: string }) => p.name);
            expect(names).toContain("active-product");
            expect(names).not.toContain("inactive-product");
        });

        // ==================== RESOURCE NOT FOUND ====================

        it("should return 200 with an empty array when no active products exist", async () => {
            const response = await request(app)
                .get("/api/product/trending")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const spy = vi.spyOn(prisma.product, "findMany").mockRejectedValueOnce(new Error("Database query failed"));

            const response = await request(app)
                .get("/api/product/trending")
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // PUT /api/product/change-availability/:id
    // =====================================================

    describe("PUT /api/product/change-availability/:id", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and toggle product isActive from true to false", async () => {
            const product = await createProductInDb({ name: "toggle-product", isActive: true });

            const response = await request(app)
                .put(`/api/product/change-availability/${product.id}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Succesfully Updated");

            // Verify database state
            const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
            expect(updatedProduct!.isActive).toBe(false);
        });

        it("should return 200 and toggle product isActive from false to true", async () => {
            const product = await createProductInDb({ name: "toggle-product", isActive: false });

            const response = await request(app)
                .put(`/api/product/change-availability/${product.id}`)
                .expect(200);

            expect(response.body.success).toBe(true);

            // Verify database state
            const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
            expect(updatedProduct!.isActive).toBe(true);
        });

        // ==================== RESOURCE NOT FOUND ====================

        it("should return 500 when product does not exist", async () => {
            const response = await request(app)
                .put("/api/product/change-availability/99999")
                .expect(500);

            expect(response.body.success).toBe(false);
            // Prisma throws a RecordNotFound error which propagates through
            // the service's catch block as a generic 500
            expect(response.body.message).toContain("No record was found for an update.");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const product = await createProductInDb();
            const spy = vi.spyOn(prisma.product, "findUnique").mockRejectedValueOnce(new Error("Database query failed"));

            const response = await request(app)
                .put(`/api/product/change-availability/${product.id}`)
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // GET /api/product/product-list
    // =====================================================

    describe("GET /api/product/product-list", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and list of all active products", async () => {
            await createProductInDb({ name: "product-1", isActive: true });
            await createProductInDb({ name: "product-2", isActive: true });
            await createProductInDb({ name: "inactive-product", isActive: false });

            const response = await request(app)
                .get("/api/product/product-list")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.messgae).toBe("Product List Successfully Retrieve");
            expect(Array.isArray(response.body.data)).toBe(true);
            // Should only return active products
            const names = response.body.data.map((p: { name: string }) => p.name);
            expect(names).toContain("product-1");
            expect(names).toContain("product-2");
            expect(names).not.toContain("inactive-product");
        });

        it("should include stock information in the response", async () => {
            await createProductInDb({ name: "stocked-product", stock: 15 });

            const response = await request(app)
                .get("/api/product/product-list")
                .expect(200);

            expect(response.body.data[0]).toHaveProperty("stock", 15);
        });

        // ==================== RESOURCE NOT FOUND ====================

        it("should return 404 when no active products exist", async () => {
            const response = await request(app)
                .get("/api/product/product-list")
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("No Available Products");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const spy = vi.spyOn(prisma.product, "findMany").mockRejectedValueOnce(new Error("Database query failed"));

            const response = await request(app)
                .get("/api/product/product-list")
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // 404 - UNKNOWN ROUTE
    // =====================================================

    describe("Unknown Routes", () => {
        it("should return 404 for an unknown route under /api/product", async () => {
            const response = await request(app)
                .get("/api/product/nonexistent-route")
                .expect(404);

            expect(response.body).toBeDefined();
        });
    });
});