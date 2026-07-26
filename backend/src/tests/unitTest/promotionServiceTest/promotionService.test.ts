import { describe, it, expect, vi, beforeEach } from "vitest";
import { PromotionService } from "../../../service/promotionService.js";
import { PromotionRepository } from "../../../repository/promotionRepository.js";
import { AppError } from "../../../utils/appError.js";

vi.mock("../../../repository/promotionRepository.js", () => ({
    PromotionRepository: {
        getBanner: vi.fn(),
    },
}));

describe("PromotionService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getBanner", () => {
        it("should return the banner when an active banner exists", async () => {
            const mockBanner = {
                id: 1,
                imageUrl: "https://example.com/banner.jpg",
                titlePrefix: "Great",
                highlightedWord: "Deals",
                description: "Check out our latest promotions!",
            };

            vi.mocked(PromotionRepository.getBanner).mockResolvedValue(mockBanner);

            const result = await PromotionService.getBanner();

            expect(PromotionRepository.getBanner).toHaveBeenCalledOnce();
            expect(result).toEqual(mockBanner);
        });

        it("should throw AppError with status 404 when no active banner exists (repository returns null)", async () => {
            vi.mocked(PromotionRepository.getBanner).mockResolvedValue(null);

            await expect(PromotionService.getBanner()).rejects.toThrow(AppError);
            await expect(PromotionService.getBanner()).rejects.toThrow("No active banner");

            try {
                await PromotionService.getBanner();
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(404);
            }
        });

        it("should throw AppError with status 404 when no active banner exists (repository returns undefined)", async () => {
            vi.mocked(PromotionRepository.getBanner).mockResolvedValue(null );

            await expect(PromotionService.getBanner()).rejects.toThrow(AppError);
            await expect(PromotionService.getBanner()).rejects.toThrow("No active banner");

            try {
                await PromotionService.getBanner();
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).statusCode).toBe(404);
            }
        });

        it("should propagate unexpected errors from the repository", async () => {
            const dbError = new Error("Database connection failed");
            vi.mocked(PromotionRepository.getBanner).mockRejectedValue(dbError);

            await expect(PromotionService.getBanner()).rejects.toThrow("Database connection failed");
            expect(PromotionRepository.getBanner).toHaveBeenCalledOnce();
        });
    });
});
