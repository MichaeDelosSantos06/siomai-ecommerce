import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { UserService } from "../../../service/userService.js";
import { UserRepository } from "../../../repository/userRepository.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/jwt.js";
import { AppError } from "../../../utils/appError.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/userRepository.js", () => ({
    UserRepository: {
        checkEmail: vi.fn(),
    },
}));

vi.mock("bcrypt", () => ({
    default: {
        compare: vi.fn(),
    },
}));

vi.mock("../../../utils/jwt.js", () => ({
    generateToken: vi.fn(),
}));

describe("UserService.login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const validInput = {
        email: "john@test.com",
        password: "123456",
    };

    const existingUser = {
        id: 1,
        email: "john@test.com",
        username: "john",
        role: "USER",
        status: "ACTIVE",
        password: "hashedPassword123",
    };

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should login successfully with valid credentials", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockReturnValue("jwt-token-abc");

        const result = await UserService.login(validInput);

        expect(UserRepository.checkEmail).toHaveBeenCalledWith("john@test.com");
        expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedPassword123");
        expect(generateToken).toHaveBeenCalledWith({
            id: 1,
            role: "USER",
            status: "ACTIVE",
            username: "john",
            email: "john@test.com",
        });
        expect(result).toEqual({
            id: 1,
            role: "USER",
            status: "ACTIVE",
            username: "john",
            email: "john@test.com",
            token: "jwt-token-abc",
        });
    });

    it("should include status field in the returned object", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.login(validInput);

        expect(result).toHaveProperty("status", "ACTIVE");
    });

    it("should include token in the returned object", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockReturnValue("generated-jwt-token");

        const result = await UserService.login(validInput);

        expect(result).toHaveProperty("token", "generated-jwt-token");
    });

    it("should pass the correct payload to generateToken", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockReturnValue("token");

        await UserService.login(validInput);

        expect(generateToken).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 1,
                username: "john",
                email: "john@test.com",
            })
        );
    });

    // =====================================================
    // FAILURE CASES - USER NOT FOUND
    // =====================================================

    it("should throw AppError when email does not exist", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);

        await expect(UserService.login(validInput)).rejects.toThrow(AppError);
        await expect(UserService.login(validInput)).rejects.toThrow("Incorrect Credentials");

        // Should NOT proceed to compare password or generate token
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 401 when email does not exist", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);

        try {
            await UserService.login(validInput);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(401);
        }
    });

    // =====================================================
    // FAILURE CASES - WRONG PASSWORD
    // =====================================================

    it("should throw AppError when password is incorrect", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockResolvedValue(false);

        await expect(UserService.login(validInput)).rejects.toThrow(AppError);
        await expect(UserService.login(validInput)).rejects.toThrow("Incorrect Credentials");

        // Should NOT generate token
        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 401 when password is incorrect", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockResolvedValue(false);

        try {
            await UserService.login(validInput);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(401);
        }
    });

    it("should not leak whether the email exists or password is wrong (same error message)", async () => {
        // Test 1: email doesn't exist -> "Incorrect Credentials"
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        await expect(UserService.login(validInput)).rejects.toThrow("Incorrect Credentials");

        // Test 2: wrong password -> "Incorrect Credentials" (same message)
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockResolvedValue(false);
        await expect(UserService.login(validInput)).rejects.toThrow("Incorrect Credentials");
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY / DEPENDENCY ERRORS
    // =====================================================

    it("should propagate error when checkEmail repository throws", async () => {
        (UserRepository.checkEmail as Mock).mockRejectedValue(new Error("Database connection failed"));

        await expect(UserService.login(validInput)).rejects.toThrow("Database connection failed");
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should propagate error when bcrypt.compare throws", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockRejectedValue(new Error("Comparison failed"));

        await expect(UserService.login(validInput)).rejects.toThrow("Comparison failed");
        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should propagate error when generateToken throws", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(existingUser);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockImplementation(() => {
            throw new Error("JWT signing failed");
        });

        await expect(UserService.login(validInput)).rejects.toThrow("JWT signing failed");
    });

    // =====================================================
    // EDGE CASES - USER DATA
    // =====================================================

    it("should handle null password field in returned user", async () => {
        const userWithNoPassword = {
            ...existingUser,
            password: null,
        };
        (UserRepository.checkEmail as Mock).mockResolvedValue(userWithNoPassword);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.login(validInput);

        expect(bcrypt.compare).toHaveBeenCalledWith("123456", null);
        expect(result.token).toBe("token");
    });

    it("should handle different user roles", async () => {
        const adminUser = {
            ...existingUser,
            role: "ADMIN",
        };
        (UserRepository.checkEmail as Mock).mockResolvedValue(adminUser);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.login(validInput);

        expect(result.role).toBe("ADMIN");
        expect(generateToken).toHaveBeenCalledWith(
            expect.objectContaining({ role: "ADMIN" })
        );
    });

    it("should handle different user statuses", async () => {
        const suspendedUser = {
            ...existingUser,
            status: "SUSPENDED",
        };
        (UserRepository.checkEmail as Mock).mockResolvedValue(suspendedUser);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.login(validInput);

        expect(result.status).toBe("SUSPENDED");
    });

    it("should handle case when user has no status field", async () => {
        const userNoStatus = {
            id: 1,
            email: "john@test.com",
            username: "john",
            role: "USER",
            password: "hashedPassword123",
        };
        (UserRepository.checkEmail as Mock).mockResolvedValue(userNoStatus);
        (bcrypt.compare as Mock).mockResolvedValue(true);
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.login(validInput);

        expect(result.status).toBeUndefined();
    });
});