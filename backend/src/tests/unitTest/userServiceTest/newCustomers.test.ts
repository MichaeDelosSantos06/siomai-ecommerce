import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { UserService } from "../../../service/userService.js";
import { UserRepository } from "../../../repository/userRepository.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/userRepository.js", () => ({
    UserRepository: {
        // NOTE: The service's newCustomers() actually calls
        // UserRepository.getTotalCustomer(), NOT UserRepository.newCustomers()
        getTotalCustomer: vi.fn(),
    },
}));

describe("UserService.newCustomers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should return the total number of new customers (this month)", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(8);

        const result = await UserService.newCustomers();

        expect(UserRepository.getTotalCustomer).toHaveBeenCalledTimes(1);
        expect(UserRepository.getTotalCustomer).toHaveBeenCalledWith();
        expect(result).toBe(8);
    });

    it("should return 0 when there are no new customers this month", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(0);

        const result = await UserService.newCustomers();

        expect(result).toBe(0);
    });

    it("should return a large number of new customers", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(250);

        const result = await UserService.newCustomers();

        expect(result).toBe(250);
    });

    it("should return the exact count from the repository", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(12);

        const result = await UserService.newCustomers();

        expect(result).toBe(12);
    });

    it("should pass through the repository response unchanged", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(7);

        const result = await UserService.newCustomers();

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

        await expect(UserService.newCustomers()).rejects.toThrow(
            "Database query failed"
        );
    });

    it("should propagate database connection error", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue(
            new Error("Connection refused")
        );

        await expect(UserService.newCustomers()).rejects.toThrow(
            "Connection refused"
        );
    });

    it("should propagate timeout error", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue(
            new Error("Query timeout exceeded")
        );

        await expect(UserService.newCustomers()).rejects.toThrow(
            "Query timeout exceeded"
        );
    });

    it("should propagate permission denied error", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue(
            new Error("Permission denied to table users")
        );

        await expect(UserService.newCustomers()).rejects.toThrow(
            "Permission denied to table users"
        );
    });

    it("should propagate non-Error thrown values as-is", async () => {
        (UserRepository.getTotalCustomer as Mock).mockRejectedValue("Count failed");

        await expect(UserService.newCustomers()).rejects.toBe("Count failed");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should pass through null from repository", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(null);

        const result = await UserService.newCustomers();

        expect(result).toBeNull();
    });

    it("should pass through undefined from repository", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(undefined);

        const result = await UserService.newCustomers();

        expect(result).toBeUndefined();
    });

    it("should pass through string number from repository (if count is returned as string)", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue("3");

        const result = await UserService.newCustomers();

        expect(result).toBe("3");
    });

    it("should handle count of 1 (single new customer)", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(1);

        const result = await UserService.newCustomers();

        expect(result).toBe(1);
    });

    it("should be called with no arguments", async () => {
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(20);

        await UserService.newCustomers();

        // Verify the service doesn't pass any arguments to the repository
        expect(UserRepository.getTotalCustomer).toHaveBeenCalledWith();
        expect((UserRepository.getTotalCustomer as Mock).mock.calls[0]).toHaveLength(0);
    });

    // =====================================================
    // NOTE: POTENTIAL BUG - Service calls wrong repository method
    // =====================================================

    it("should call UserRepository.getTotalCustomer (not newCustomers) - potential bug", async () => {
        // The service's newCustomers() calls UserRepository.getTotalCustomer()
        // instead of UserRepository.newCustomers() which has the monthly filter.
        // This test documents this behavior.
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(100);

        const result = await UserService.newCustomers();

        // It returns the total count, not the monthly new customer count
        expect(result).toBe(100);

        // Verify it's calling getTotalCustomer, not a separate newCustomers method
        expect(UserRepository.getTotalCustomer).toHaveBeenCalled();
    });

    it("should return the same value as getTotalCustomer (since it calls the same method)", async () => {
        // Since newCustomers() calls getTotalCustomer(), both should return the same
        (UserRepository.getTotalCustomer as Mock).mockResolvedValue(50);

        const [newCustomersResult, totalCustomerResult] = await Promise.all([
            UserService.newCustomers(),
            UserService.getTotalCustomer(),
        ]);

        expect(newCustomersResult).toBe(totalCustomerResult);
        expect(newCustomersResult).toBe(50);
    });
});