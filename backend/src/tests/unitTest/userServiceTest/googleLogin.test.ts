import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import { UserService } from "../../../service/userService.js";
import { UserRepository } from "../../../repository/userRepository.js";
import axios from "axios";
import { generateToken } from "../../../utils/jwt.js";

// ------------------ MOCKS ------------------

vi.mock("../../../repository/userRepository.js", () => ({
    UserRepository: {
        googleLogin: vi.fn(),
    },
}));

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock("../../../utils/jwt.js", () => ({
    generateToken: vi.fn(),
}));

describe("UserService.googleLogin", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const validAccessToken = "valid-google-access-token";

    const googleUserResponse = {
        data: {
            email: "google@test.com",
            name: "Google User",
            sub: "google123",
        },
    };

    const databaseUser = {
        id: 99,
        email: "google@test.com",
        username: "Google User",
    };

    // =====================================================
    // SUCCESS CASES
    // =====================================================

    it("should login successfully with a valid Google access token", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockResolvedValue(databaseUser);
        (generateToken as Mock).mockReturnValue("google-jwt-token");

        const result = await UserService.googleLogin({
            accessToken: validAccessToken,
        });

        expect(axios.get).toHaveBeenCalledWith(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: "Bearer valid-google-access-token",
                },
            }
        );
        expect(UserRepository.googleLogin).toHaveBeenCalledWith({
            email: "google@test.com",
            name: "Google User",
            sub: "google123",
        });
        expect(generateToken).toHaveBeenCalledWith({
            id: 99,
            email: "google@test.com",
        });
        expect(result).toEqual({
            user: {
                id: 99,
                email: "google@test.com",
                username: "Google User",
            },
            token: "google-jwt-token",
        });
    });

    it("should return an object with 'user' and 'token' properties", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockResolvedValue(databaseUser);
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.googleLogin({
            accessToken: validAccessToken,
        });

        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("token");
        expect(Object.keys(result)).toEqual(["user", "token"]);
    });

    it("should pass the full Google user info object to UserRepository.googleLogin", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockResolvedValue(databaseUser);
        (generateToken as Mock).mockReturnValue("token");

        await UserService.googleLogin({ accessToken: validAccessToken });

        expect(UserRepository.googleLogin).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "google@test.com",
                name: "Google User",
                sub: "google123",
            })
        );
    });

    it("should generate token with only id and email from the database user", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockResolvedValue(databaseUser);
        (generateToken as Mock).mockReturnValue("token");

        await UserService.googleLogin({ accessToken: validAccessToken });

        expect(generateToken).toHaveBeenCalledWith({
            id: 99,
            email: "google@test.com",
        });
    });

    it("should pass only the access token in the Authorization header", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockResolvedValue(databaseUser);
        (generateToken as Mock).mockReturnValue("token");

        await UserService.googleLogin({ accessToken: validAccessToken });

        expect(axios.get).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: {
                    Authorization: "Bearer valid-google-access-token",
                },
            })
        );
    });

    // =====================================================
    // FAILURE CASES - GOOGLE API ERRORS
    // =====================================================

    it("should propagate error when Google API call fails", async () => {
        (axios.get as Mock).mockRejectedValue(new Error("Google API failed"));

        await expect(
            UserService.googleLogin({ accessToken: "invalid-token" })
        ).rejects.toThrow("Google API failed");

        // Should NOT proceed to repository or token generation
        expect(UserRepository.googleLogin).not.toHaveBeenCalled();
        expect(generateToken).not.toHaveBeenCalled();
    });

    it("should propagate 401 error from Google API", async () => {
        const axiosError = new Error("Request failed with status code 401");
        (axios.get as Mock).mockRejectedValue(axiosError);

        await expect(
            UserService.googleLogin({ accessToken: "expired-token" })
        ).rejects.toThrow("Request failed with status code 401");
    });

    it("should propagate network error from Google API", async () => {
        (axios.get as Mock).mockRejectedValue(new Error("Network Error"));

        await expect(
            UserService.googleLogin({ accessToken: "any-token" })
        ).rejects.toThrow("Network Error");
    });

    // =====================================================
    // FAILURE CASES - REPOSITORY ERRORS
    // =====================================================

    it("should propagate error when UserRepository.googleLogin throws", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockRejectedValue(
            new Error("Failed to upsert user in database")
        );

        await expect(
            UserService.googleLogin({ accessToken: validAccessToken })
        ).rejects.toThrow("Failed to upsert user in database");
    });

    it("should propagate database constraint error", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockRejectedValue(
            new Error("Unique constraint violation")
        );

        await expect(
            UserService.googleLogin({ accessToken: validAccessToken })
        ).rejects.toThrow("Unique constraint violation");
    });

    it("should propagate error when generateToken throws after successful Google login", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockResolvedValue(databaseUser);
        (generateToken as Mock).mockImplementation(() => {
            throw new Error("JWT signing failed");
        });

        await expect(
            UserService.googleLogin({ accessToken: validAccessToken })
        ).rejects.toThrow("JWT signing failed");
    });

    // =====================================================
    // EDGE CASES - GOOGLE USER DATA
    // =====================================================

    it("should handle Google user with special characters in name", async () => {
        (axios.get as Mock).mockResolvedValue({
            data: {
                email: "special@test.com",
                name: "O'Brien & Smith",
                sub: "google456",
            },
        });
        (UserRepository.googleLogin as Mock).mockResolvedValue({
            id: 100,
            email: "special@test.com",
            username: "O'Brien & Smith",
        });
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.googleLogin({
            accessToken: validAccessToken,
        });

        expect(UserRepository.googleLogin).toHaveBeenCalledWith(
            expect.objectContaining({ name: "O'Brien & Smith" })
        );
        expect(result.user.id).toBe(100);
    });

    it("should handle Google user without name field", async () => {
        (axios.get as Mock).mockResolvedValue({
            data: {
                email: "noname@test.com",
                name: undefined,
                sub: "google789",
            },
        });
        (UserRepository.googleLogin as Mock).mockResolvedValue({
            id: 101,
            email: "noname@test.com",
            username: undefined,
        });
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.googleLogin({
            accessToken: validAccessToken,
        });

        expect(UserRepository.googleLogin).toHaveBeenCalledWith(
            expect.objectContaining({ name: undefined })
        );
        expect(result.user.username).toBeUndefined();
    });

    it("should handle Google user with empty sub field", async () => {
        (axios.get as Mock).mockResolvedValue({
            data: {
                email: "nosub@test.com",
                name: "No Sub",
                sub: "",
            },
        });
        (UserRepository.googleLogin as Mock).mockResolvedValue({
            id: 102,
            email: "nosub@test.com",
            username: "No Sub",
        });
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.googleLogin({
            accessToken: validAccessToken,
        });

        expect(UserRepository.googleLogin).toHaveBeenCalledWith(
            expect.objectContaining({ sub: "" })
        );
        expect(result.user.id).toBe(102);
    });

    it("should handle existing user (not new) - upsert returns existing user", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockResolvedValue({
            id: 50,
            email: "google@test.com",
            username: "ExistingGoogleUser",
        });
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.googleLogin({
            accessToken: validAccessToken,
        });

        expect(result.user.id).toBe(50);
        expect(result.user.username).toBe("ExistingGoogleUser");
    });

    it("should create a new user when Google email doesn't exist in database", async () => {
        (axios.get as Mock).mockResolvedValue(googleUserResponse);
        (UserRepository.googleLogin as Mock).mockResolvedValue({
            id: 200,
            email: "google@test.com",
            username: "Google User",
        });
        (generateToken as Mock).mockReturnValue("token");

        const result = await UserService.googleLogin({
            accessToken: validAccessToken,
        });

        expect(result.user.id).toBe(200);
        expect(result.user.email).toBe("google@test.com");
    });
});