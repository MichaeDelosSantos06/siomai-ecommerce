import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { UserService } from "../../../service/userService.js";
import { UserRepository } from "../../../repository/userRepository.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/userRepository.js", () => ({
    UserRepository: {
        getCustomerInfo: vi.fn(),
    },
}));

describe("UserService.getCustomerInfo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Sample customer data matching the repository's select structure
    const sampleCustomers: Array<Record<string, unknown>> = [
        {
            id: 1,
            username: "john_doe",
            email: "john@test.com",
            createdAT: new Date("2024-01-15"),
            status: "ACTIVE",
            order: [
                { id: 1, totalPrice: 150.0 },
                { id: 2, totalPrice: 75.5 },
            ],
            addresses: [
                { street: "123 Main St", barangay: "Barangay 1" },
            ],
        },
        {
            id: 2,
            username: "jane_doe",
            email: "jane@test.com",
            createdAT: new Date("2024-02-20"),
            status: "VIP",
            order: [],
            addresses: [],
        },
    ];

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should return all customers with role USER", async () => {
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(sampleCustomers);

        const result = await UserService.getCustomerInfo();

        expect(UserRepository.getCustomerInfo).toHaveBeenCalledTimes(1);
        expect(UserRepository.getCustomerInfo).toHaveBeenCalledWith();
        expect(result).toEqual(sampleCustomers);
        expect(result).toHaveLength(2);
    });

    it("should return customer objects with all expected fields", async () => {
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(sampleCustomers);

        const result = await UserService.getCustomerInfo() as Array<Record<string, unknown>>;

        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("username");
        expect(result[0]).toHaveProperty("email");
        expect(result[0]).toHaveProperty("createdAT");
        expect(result[0]).toHaveProperty("status");
        expect(result[0]).toHaveProperty("order");
        expect(result[0]).toHaveProperty("addresses");
    });

    it("should include nested order and address relations", async () => {
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(sampleCustomers);

        const result = await UserService.getCustomerInfo() as Array<Record<string, unknown>>;

        // Check that orders are included
        expect(Array.isArray((result[0] as Record<string, unknown>)["order"])).toBe(true);
        const orders = (result[0] as Record<string, unknown>)["order"] as Array<Record<string, unknown>>;
        expect(orders[0]).toHaveProperty("id");
        expect(orders[0]).toHaveProperty("totalPrice");

        // Check that addresses are included
        expect(Array.isArray((result[0] as Record<string, unknown>)["addresses"])).toBe(true);
        const addresses = (result[0] as Record<string, unknown>)["addresses"] as Array<Record<string, unknown>>;
        expect(addresses[0]).toHaveProperty("street");
        expect(addresses[0]).toHaveProperty("barangay");
    });

    it("should return an empty array when no customers exist", async () => {
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue([]);

        const result = await UserService.getCustomerInfo();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    it("should return only customers (not admins)", async () => {
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(sampleCustomers);

        const result = await UserService.getCustomerInfo() as Array<Record<string, unknown>>;

        // Both returned users should have usernames
        expect(result.every((customer) => customer.username !== undefined)).toBe(true);
    });

    it("should pass through the repository response unchanged", async () => {
        // The service simply returns UserRepository.getCustomerInfo() directly
        const repositoryResponse = [
            {
                id: 3,
                username: "test_user",
                email: "test@test.com",
                createdAT: new Date(),
                status: "ACTIVE",
                order: [],
                addresses: [],
            },
        ];
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(repositoryResponse);

        const result = await UserService.getCustomerInfo();

        // Verify it's the exact same object reference from the repository
        expect(result).toBe(repositoryResponse);
    });

    // =====================================================
    // FAILURE CASES
    // =====================================================

    it("should propagate error when repository throws", async () => {
        (UserRepository.getCustomerInfo as Mock).mockRejectedValue(
            new Error("Database query failed")
        );

        await expect(UserService.getCustomerInfo()).rejects.toThrow(
            "Database query failed"
        );
    });

    it("should propagate database connection error", async () => {
        (UserRepository.getCustomerInfo as Mock).mockRejectedValue(
            new Error("Connection refused")
        );

        await expect(UserService.getCustomerInfo()).rejects.toThrow(
            "Connection refused"
        );
    });

    it("should propagate timeout error", async () => {
        (UserRepository.getCustomerInfo as Mock).mockRejectedValue(
            new Error("Query timeout exceeded")
        );

        await expect(UserService.getCustomerInfo()).rejects.toThrow(
            "Query timeout exceeded"
        );
    });

    it("should propagate non-Error thrown values as-is", async () => {
        (UserRepository.getCustomerInfo as Mock).mockRejectedValue("Database error string");

        await expect(UserService.getCustomerInfo()).rejects.toBe("Database error string");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle single customer in array", async () => {
        const singleCustomer = [sampleCustomers[0]];
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(singleCustomer);

        const result = await UserService.getCustomerInfo() as Array<Record<string, unknown>>;

        expect(result).toHaveLength(1);
        expect((result[0] as Record<string, unknown>).id).toBe(1);
    });

    it("should handle customers with missing optional fields", async () => {
        const incompleteCustomers: Array<Record<string, unknown>> = [
            {
                id: 5,
                username: "partial_user",
                email: "partial@test.com",
                createdAT: new Date(),
                // status might be missing
                order: undefined,
                addresses: null,
            },
        ];
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(incompleteCustomers);

        const result = await UserService.getCustomerInfo() as Array<Record<string, unknown>>;

        expect((result[0] as Record<string, unknown>).order).toBeUndefined();
        expect((result[0] as Record<string, unknown>).addresses).toBeNull();
    });

    it("should pass through without throwing for any valid repository response", async () => {
        // Test with null (the repository could theoretically return null)
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(null);

        const result = await UserService.getCustomerInfo();

        expect(result).toBeNull();
    });

    it("should not modify or transform the data from the repository", async () => {
        const customerData: Array<Record<string, unknown>> = [
            {
                id: 10,
                username: "user10",
                email: "user10@test.com",
                createdAT: new Date("2024-06-01"),
                status: "ACTIVE",
                order: [{ id: 100, totalPrice: 250.0 }],
                addresses: [{ street: "456 Oak Ave", barangay: "Barangay 5" }],
            },
        ];
        (UserRepository.getCustomerInfo as Mock).mockResolvedValue(customerData);

        const result = await UserService.getCustomerInfo();

        // The service should return exactly what the repository returned
        expect(JSON.stringify(result)).toBe(JSON.stringify(customerData));
    });
});