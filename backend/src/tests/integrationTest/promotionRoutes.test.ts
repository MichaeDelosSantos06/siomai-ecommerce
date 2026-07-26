import "dotenv/config";
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import type { Express } from "express";
import { prisma } from "../../lib/prisma.js";

// ------------------ MOCKS (none needed - no external services) ------------------

// ------------------ IMPORTS ------------------

import promotionRoutes from "../../routes/promotionRoutes.js";
import { errorHandler } from "../../middleware/errorHandler.js";

// ------------------ TEST SETUP ------------------

const createTestApp = (): Express => {
    const app = express();
    app.use(express.json());
    app.use("/api", promotionRoutes);
    app.use(errorHandler);
    return app;
};

// ==================== HELPERS ====================

const createBannerInDb = async (overrides: Partial<{
    imageUrl: string;
    titlePrefix: string;
    highlightedWord: string;
    description: string;
    isActive: boolean;
}> = {}) => {
    return prisma.promotion.create({
        data: {
            imageUrl: overrides.imageUrl ?? "http://example.com/banner.jpg",
            titlePrefix: overrides.titlePrefix ?? "Summer",
            highlightedWord: overrides.highlightedWord ?? "Sale",
            description: overrides.description ?? "Big summer sale!",
            isActive: overrides.isActive ?? true,
        },
    });
};

// ==================== TEST SUITE ====================

describe("Promotion Routes - Integration Tests", () => {
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
    // GET /api/promotion/get-banner
    // =====================================================

    describe("GET /api/promotion/get-banner", () => {
        // ==================== SUCCESS ====================

        it("should return 200 and the most recent active banner", async () => {
            await createBannerInDb({
                titlePrefix: "Older",
                highlightedWord: "Banner",
                description: "Older banner",
                isActive: true,
            });
            // Small delay to ensure different timestamps
            await new Promise((r) => setTimeout(r, 50));
            await createBannerInDb({
                titlePrefix: "Newer",
                highlightedWord: "Banner",
                description: "Newer banner",
                isActive: true,
            });

            const response = await request(app)
                .get("/api/promotion/get-banner")
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Active Banner Retrieve");
            expect(response.body.data).toHaveProperty("titlePrefix", "Newer");
            expect(response.body.data).toHaveProperty("highlightedWord", "Banner");
            expect(response.body.data).toHaveProperty("description", "Newer banner");
            expect(response.body.data).toHaveProperty("imageUrl");
            expect(response.body.data).not.toHaveProperty("isActive"); // not exposed in select
        });

        it("should return only active banners (not inactive ones)", async () => {
            await createBannerInDb({
                titlePrefix: "Active",
                highlightedWord: "Banner",
                description: "This is active",
                isActive: true,
            });
            await createBannerInDb({
                titlePrefix: "Inactive",
                highlightedWord: "Banner",
                description: "This is inactive",
                isActive: false,
            });

            const response = await request(app)
                .get("/api/promotion/get-banner")
                .expect(200);

            expect(response.body.data.titlePrefix).toBe("Active");
            expect(response.body.data.titlePrefix).not.toBe("Inactive");
        });

        // ==================== RESOURCE NOT FOUND ====================

        it("should return 404 when no active banners exist", async () => {
            const response = await request(app)
                .get("/api/promotion/get-banner")
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("No active banner");
        });

        it("should return 404 when only inactive banners exist", async () => {
            await createBannerInDb({
                titlePrefix: "Inactive Only",
                highlightedWord: "Banner",
                description: "Not active",
                isActive: false,
            });

            const response = await request(app)
                .get("/api/promotion/get-banner")
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("No active banner");
        });

        // ==================== INTERNAL SERVER ERROR ====================

        it("should return 500 when an unexpected database error occurs", async () => {
            const spy = vi.spyOn(prisma.promotion, "findFirst").mockRejectedValueOnce(new Error("Database query failed"));

            const response = await request(app)
                .get("/api/promotion/get-banner")
                .expect(500);

            expect(response.body.success).toBe(false);
            spy.mockRestore();
        });
    });

    // =====================================================
    // 404 - UNKNOWN ROUTE
    // =====================================================

    describe("Unknown Routes", () => {
        it("should return 404 for an unknown route under /api/promotion", async () => {
            const response = await request(app)
                .get("/api/promotion/nonexistent-route")
                .expect(404);

            expect(response.body).toBeDefined();
        });
    });
});