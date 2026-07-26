import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { UserService } from "../../../service/userService.js";
import { UserRepository } from "../../../repository/userRepository.js";
import bcrypt from "bcrypt";
import { AppError } from "../../../utils/appError.js";
import type { RegisterUser } from "../../../types/userType.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/userRepository.js", () => ({
    UserRepository: {
        register: vi.fn(),
        checkEmail: vi.fn(),
        checkUsername: vi.fn(),
    },
}));

vi.mock("bcrypt", () => ({
    default: {
        hash: vi.fn(),
    },
}));

describe("UserService.register", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const validInput = {
        email: "john@test.com",
        username: "john",
        password: "123456",
    };

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should register a new user successfully when email and username are unique", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockResolvedValue("hashedPassword");
        (UserRepository.register as Mock).mockResolvedValue({
            id: 1,
            email: "john@test.com",
            username: "john",
        } as RegisterUser);

        const result = await UserService.register(validInput);

        expect(UserRepository.checkEmail).toHaveBeenCalledWith("john@test.com");
        expect(UserRepository.checkUsername).toHaveBeenCalledWith("john");
        expect(bcrypt.hash).toHaveBeenCalledWith("123456", 12);
        expect(UserRepository.register).toHaveBeenCalledWith({
            email: "john@test.com",
            username: "john",
            password: "hashedPassword",
        });
        expect(result).toEqual({
            id: 1,
            email: "john@test.com",
            username: "john",
        });
    });

    it("should hash the password with salt rounds of 12", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockResolvedValue("hashedPassword");
        (UserRepository.register as Mock).mockResolvedValue({
            id: 1,
            email: "john@test.com",
            username: "john",
        } as RegisterUser);

        await UserService.register(validInput);

        expect(bcrypt.hash).toHaveBeenCalledWith("123456", 12);
    });

    it("should pass the hashed password (not plain text) to the repository", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockResolvedValue("super-secure-hash-abc123");
        (UserRepository.register as Mock).mockResolvedValue({
            id: 1,
            email: "john@test.com",
            username: "john",
        } as RegisterUser);

        await UserService.register(validInput);

        expect(UserRepository.register).toHaveBeenCalledWith({
            email: "john@test.com",
            username: "john",
            password: "super-secure-hash-abc123",
        });
        // Ensure plain text password is NOT passed to the repository
        expect(UserRepository.register).not.toHaveBeenCalledWith(
            expect.objectContaining({ password: "123456" })
        );
    });

    // =====================================================
    // FAILURE CASES - EMAIL
    // =====================================================

    it("should throw AppError with status 400 when email already exists", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue({
            id: 1,
            email: "john@test.com",
        });

        await expect(UserService.register(validInput)).rejects.toThrow(AppError);
        await expect(UserService.register(validInput)).rejects.toThrow("Email already Exsit");

        // Should NOT proceed to check username or register
        expect(UserRepository.checkUsername).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(UserRepository.register).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 400 when email already exists", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue({
            id: 1,
            email: "john@test.com",
        });

        try {
            await UserService.register(validInput);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(400);
        }
    });

    // =====================================================
    // FAILURE CASES - USERNAME
    // =====================================================

    it("should throw AppError when username is already taken", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue({
            id: 1,
            username: "john",
        });

        await expect(UserService.register(validInput)).rejects.toThrow(AppError);
        await expect(UserService.register(validInput)).rejects.toThrow("Username taken");

        // Should NOT proceed to register
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(UserRepository.register).not.toHaveBeenCalled();
    });

    it("should throw AppError with statusCode 400 when username is already taken", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue({
            id: 1,
            username: "john",
        });

        try {
            await UserService.register(validInput);
        } catch (error) {
            expect(error).toBeInstanceOf(AppError);
            expect((error as AppError).statusCode).toBe(400);
        }
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when checkEmail repository throws", async () => {
        (UserRepository.checkEmail as Mock).mockRejectedValue(new Error("Database connection failed"));

        await expect(UserService.register(validInput)).rejects.toThrow("Database connection failed");
        expect(UserRepository.checkUsername).not.toHaveBeenCalled();
        expect(UserRepository.register).not.toHaveBeenCalled();
    });

    it("should propagate error when checkUsername repository throws", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockRejectedValue(new Error("Database timeout"));

        await expect(UserService.register(validInput)).rejects.toThrow("Database timeout");
        expect(UserRepository.register).not.toHaveBeenCalled();
    });

    it("should propagate error when bcrypt.hash throws", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockRejectedValue(new Error("Hashing failed"));

        await expect(UserService.register(validInput)).rejects.toThrow("Hashing failed");
        expect(UserRepository.register).not.toHaveBeenCalled();
    });

    it("should propagate error when register repository throws", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockResolvedValue("hashedPassword");
        (UserRepository.register as Mock).mockRejectedValue(new Error("Insert failed"));

        await expect(UserService.register(validInput)).rejects.toThrow("Insert failed");
    });

    // =====================================================
    // EDGE CASES
    // =====================================================

    it("should handle empty email gracefully", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockResolvedValue("hashedPassword");
        (UserRepository.register as Mock).mockResolvedValue({
            id: 2,
            email: "",
            username: "testuser",
        } as RegisterUser);

        const result = await UserService.register({
            email: "",
            username: "testuser",
            password: "password123",
        });

        expect(UserRepository.checkEmail).toHaveBeenCalledWith("");
        expect(result).toEqual({
            id: 2,
            email: "",
            username: "testuser",
        });
    });

    it("should handle empty username gracefully", async () => {
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockResolvedValue("hashedPassword");
        (UserRepository.register as Mock).mockResolvedValue({
            id: 3,
            email: "test@test.com",
            username: "",
        } as RegisterUser);

        const result = await UserService.register({
            email: "test@test.com",
            username: "",
            password: "password123",
        });

        expect(UserRepository.checkUsername).toHaveBeenCalledWith("");
        expect(result).toEqual({
            id: 3,
            email: "test@test.com",
            username: "",
        });
    });

    it("should handle very long password", async () => {
        const longPassword = "a".repeat(100);
        (UserRepository.checkEmail as Mock).mockResolvedValue(null);
        (UserRepository.checkUsername as Mock).mockResolvedValue(null);
        (bcrypt.hash as Mock).mockResolvedValue("hashedLongPassword");
        (UserRepository.register as Mock).mockResolvedValue({
            id: 4,
            email: "test@test.com",
            username: "testuser",
        } as RegisterUser);

        const result = await UserService.register({
            email: "test@test.com",
            username: "testuser",
            password: longPassword,
        });

        expect(bcrypt.hash).toHaveBeenCalledWith(longPassword, 12);
        expect(result).toEqual({
            id: 4,
            email: "test@test.com",
            username: "testuser",
        });
    });
});