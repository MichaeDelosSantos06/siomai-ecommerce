import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email("Invalid email format").trim(),
    username: z.string().trim().toLowerCase().min(2, "username must be at leas 2 character"),
    password: z.string().trim().min(6, "password must be at least 6 character").regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must include uppercase, lowercase, and a number")
});

export const CreateUserLoginSchema = z.object({
    email: z.string("email is required").trim().toLowerCase().email("Invalid Email format"),
    password: z.string("password is required").trim(),
});