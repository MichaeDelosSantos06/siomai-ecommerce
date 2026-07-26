import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { UserService } from "../../../service/userService.js";
import { UserRepository } from "../../../repository/userRepository.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/userRepository.js", () => ({
    UserRepository: {
        getTotalCustomer: vi.fn(),
    },
}));

describe("UserService.getTotalCustomer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should return the total number of customers with role USER", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(10);

        const result = await UserService.getTotalCustomer();

        expect(UserRepository.getTotalCustomer).toHaveBeenCalledTimes(1);
        expect(UserRepository.getTotalCustomer).toHaveBeenCalledWith();
        expect(result).toBe(10);
    });

    it("should return 0 when there are no customers", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(0);

        const result = await UserService.getTotalCustomer();

        expect(result).toBe(0);
    });

    it("should return a large number of customers", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(10000);

        const result = await UserService.getTotalCustomer();

        expect(result).toBe(10000);
    });

    it("should return the exact count from the repository", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(42);

        const result = await UserService.getTotalCustomer();

        expect(result).toBe(42);
    });

    it("should pass through the repository response unchanged", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(7);

        const result = await UserService.getTotalCustomer();

        // The service doesn't transform the value, just passes it through
        expect(result).toBe(7);
    });

    // =====================================================
    // FAILURE CASES
    // =====================================================

    it("should propagate error when repository throws", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue(
            new Error("Database query failed")
        );

        await expect(UserService.getTotalCustomer()).rejects.toThrow(
            "Database query failed"
        );
    });

    it("should propagate database connection error", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue(
            new Error("Connection refused")
        );

        await expect(UserService.getTotalCustomer()).rejects.toThrow(
            "Connection refused"
        );
    });

    it("should propagate timeout error", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue(
            new Error("Query timeout exceeded")
        );

        await expect(UserService.getTotalCustomer()).rejects.toThrow(
            "Query timeout exceeded"
        );
    });

    it("should propagate permission denied error", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue(
            new Error("Permission denied to table users")
        );

        await expect(UserService.getTotalCustomer()).rejects.toThrow(
            "Permission denied to table users"
        );
    });

    it("should propagate non-Error thrown values as-is", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue("Count failed");

        await expect(UserService.getTotalCustomer()).rejects.toBe("Count failed");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should pass through null from repository", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(null);

        const result = await UserService.getTotalCustomer();

        expect(result).toBeNull();
    });

    it("should pass through undefined from repository", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(undefined);

        const result = await UserService.getTotalCustomer();

        expect(result).toBeUndefined();
    });

    it("should pass through string number from repository (if repository returns string)", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue("5");

        const result = await UserService.getTotalCustomer();

        expect(result).toBe("5");
    });

    it("should handle count of 1 (single customer)", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(1);

        const result = await UserService.getTotalCustomer();

        expect(result).toBe(1);
    });

    it("should be called with no arguments", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(25);

        await UserService.getTotalCustomer();

        // Verify the service doesn't pass any arguments to the repository
        expect(UserRepository.getTotalCustomer).toHaveBeenCalledWith();
        expect((UserRepository.getTotalCustomer as Mock).mock.calls[0]).toHaveLength(0);
    });
});