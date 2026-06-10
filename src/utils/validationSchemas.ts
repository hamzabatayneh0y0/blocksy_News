import { z } from 'zod';

// Create Article Schema
export const createArticleSchema = z.object({
    title: z.string({
        required_error: "title is required",
        invalid_type_error: "title should be of type string"
    })
    .min(2, { message: "title should be at least 2 characters long" })
    .max(200, { message: "title should be less than 200 characters" }),

    description: z.string().min(10,{ message: "description should be at least 10 characters long" }),
});

// Register Schema
export const registerSchema = z.object({
    username: z.string().min(2,{ message: "username should be at least 2 characters long" }).max(100, { message: "username should be less than 100 characters" }), 
    email: z.string().min(3,{ message: "email should be at least 3 characters long" }).max(200, { message: "email should be less than 200 characters" }).email(),
    password: z.string().min(6,{ message: "password should be at least 6 characters long" }),
});

// Login Schema
export const loginSchema = z.object({
    email: z.string().min(3).max(200, { message: "email should be less than 200 characters" }).email(),
    password: z.string().min(6,{ message: "password should be at least 6 characters long" }),
});

// Create Comment Schema
export const createCommentShema = z.object({
    text: z.string().min(2,{ message: "text should be at least 2 characters long" }).max(500, { message: "text should be less than 500 characters" }),
    articleId: z.number(),
});

// Update User Profile Schema
export const updateUserSchema = z.object({
    username: z.string().min(2,{ message: "username should be at least 2 characters long" }).max(100,{ message: "username should be less than 100 characters" }).optional(),
    email: z.string().min(3,{ message: "email should be at least 3 characters long" }).max(200, { message: "email should be less than 200 characters" }).email().optional(),
    password: z.string().min(6,{ message: "password should be at least 6 characters long" }).optional(),
});