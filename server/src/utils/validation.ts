import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const createTreeSchema = z.object({
    value: z.number(),
});

export const createNodeSchema = z.object({
    parentId: z.string(),
    op: z.enum(['+', '-', '*', '/']),
    right: z.number(),
});
