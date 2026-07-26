import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { UserService } from "../../../service/userService.js";
import { UserRepository } from "../../../repository/userRepository.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/userRepository.js", () => ({
    UserRepository: {
        getTotalVipCustomer: vi.fn(),
    },
}));

describe("UserService.getTotalVipCustomer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should return the total number of VIP customers", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(5);

        const result = await UserService.getTotalVipCustomer();

        expect(UserRepository.getTotalVipCustomer).toHaveBeenCalledTimes(1);
        expect(UserRepository.getTotalVipCustomer).toHaveBeenCalledWith();
        expect(result).toBe(5);
    });

    it("should return 0 when there are no VIP customers", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(0);

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBe(0);
    });

    it("should return a large number of VIP customers", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(500);

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBe(500);
    });

    it("should return the exact count from the repository", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(15);

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBe(15);
    });

    it("should pass through the repository response unchanged", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(3);

        const result = await UserService.getTotalVipCustomer();

        // The service doesn't transform the value, just passes it through
        expect(result).toBe(3);
    });

    it("should return a different count than total customers (VIP subset)", async () => {
        // Total customers might be 20, but VIP customers might be only 8
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(8);

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBe(8);
        // This specifically filters where status is "VIP"
        expect(result).not.toBe(20); // Not all customers are VIP
    });

    // =====================================================
    // FAILURE CASES
    // =====================================================

    it("should propagate error when repository throws", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockRejectedValue(
            new Error("Database query failed")
        );

        await expect(UserService.getTotalVipCustomer()).rejects.toThrow(
            "Database query failed"
        );
    });

    it("should propagate database connection error", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockRejectedValue(
            new Error("Connection refused")
        );

        await expect(UserService.getTotalVipCustomer()).rejects.toThrow(
            "Connection refused"
        );
    });

    it("should propagate timeout error", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockRejectedValue(
            new Error("Query timeout exceeded")
        );

        await expect(UserService.getTotalVipCustomer()).rejects.toThrow(
            "Query timeout exceeded"
        );
    });

    it("should propagate permission denied error", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockRejectedValue(
            new Error("Permission denied to table users")
        );

        await expect(UserService.getTotalVipCustomer()).rejects.toThrow(
            "Permission denied to table users"
        );
    });

    it("should propagate unknown error thrown from repository", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockRejectedValue(
            "Unexpected error occurred"
        );

        await expect(UserService.getTotalVipCustomer()).rejects.toBe(
            "Unexpected error occurred"
        );
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should pass through null from repository", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(null);

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBeNull();
    });

    it("should pass through undefined from repository", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(undefined);

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBeUndefined();
    });

    it("should pass through string number from repository (if count is returned as string)", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue("12");

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBe("12");
    });

    it("should handle VIP count of 1 (single VIP customer)", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(1);

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBe(1);
    });

    it("should be called with no arguments", async () => {
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(25);

        await UserService.getTotalVipCustomer();

        // Verify the service doesn't pass any arguments to the repository
        expect(UserRepository.getTotalVipCustomer).toHaveBeenCalledWith();
        expect((UserRepository.getTotalVipCustomer as Mock).mock.calls[0]).toHaveLength(0);
    });

    it("should handle the scenario where all customers are VIP", async () => {
        // If total customers = 50 and all are VIP
        (UserRepository.getTotalVipCustomer as Mock).mockResolvedValue(50);

        const result = await UserService.getTotalVipCustomer();

        expect(result).toBe(50);
    });
});