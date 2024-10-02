import { z, string } from 'zod'

export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Password should be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Password should contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Password should contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Password should contain at least one special character.',
        })
        .trim(),
})

export const SigninFormSchema = z.object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
})
