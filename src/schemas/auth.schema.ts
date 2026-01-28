import z from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const registerSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  avatarUrl: z.string().url({ message: 'Invalid avatar URL' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
