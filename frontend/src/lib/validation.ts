import { z } from 'zod';

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Минимальная длина: 3 символа')
        .max(30, 'Максимальная длина: 30 символов'),
    email: z
        .string()
        .min(1, 'Введите email'),
    name: z
        .string()
        .min(2, 'Минимальная длина: 2 символа')
        .max(50, 'Максимальная длина: 50 символов'),
    password: z
        .string()
        .min(6, 'Минимальная длина: 6 символов')
        .max(50, 'Максимальная длина: 50 символов'),
});

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, 'Введите имя пользователя'),
    password: z
        .string()
        .min(1, 'Введите пароль'),
});

export const deedSchema = z.object({
    title: z
        .string()
        .min(3, 'Минимальная длина: 3 символа')
        .max(100, 'Максимальная длина: 100 символов'),
    description: z
        .string()
        .max(500, 'Максимальная длина: 500 символов')
        .optional()
        .or(z.literal('')),
});

export const updateProfileSchema = z.object({
    username: z
        .string()
        .min(3, 'Минимальная длина: 3 символа')
        .max(30, 'Максимальная длина: 30 символов'),
    email: z
        .string()
        .min(1, 'Введите email'),
    name: z
        .string()
        .min(2, 'Минимальная длина: 2 символа')
        .max(50, 'Максимальная длина: 50 символов'),
    password: z
        .string()
        .min(6, 'Минимальная длина: 6 символов')
        .optional()
        .or(z.literal('')),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type DeedFormData = z.infer<typeof deedSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export function parseZodErrors(error: z.ZodError): Record<string, string> {
    const fieldErrors: Record<string, string> = {};

    error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if(!fieldErrors[field]) fieldErrors[field] = issue.message;
    });
    return fieldErrors;
};