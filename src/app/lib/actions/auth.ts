'use server';

import { AuthError } from "next-auth";
import bcrypt from 'bcryptjs';

import { signIn } from "@/auth";
import { SignupFormSchema } from "@/app/lib/definitions";
import { getDb } from "@/db";
import { User } from "@/db/entity/User";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signinUser(_prevState: string | undefined, formData: FormData) {
    let resultCallbackUrl = '/'
    const headersList = headers();
    const urlStr = headersList.get('referer');
    if (urlStr) {
        const url = new URL(urlStr)
        const callbackUrlStr = url.searchParams.get('callbackUrl');
        if (callbackUrlStr) {
            const callbackUrl = new URL(callbackUrlStr);
            resultCallbackUrl = callbackUrl.pathname || resultCallbackUrl;
        }
    }
    try {
        const db = await getDb();
        const isAdmin = (await db.getRepository(User).findOne({ where: { email: formData.get('email')?.toString() } }))?.isAdmin;
        formData.set('redirectTo', isAdmin ? resultCallbackUrl : '/');
        await signIn('credentials', formData);
    } catch (err) {
        if (err instanceof AuthError) {
            return err.cause?.err?.message;
        }
        throw err;
    }
}

export async function signupUser(_prevState: string | undefined, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return validatedFields.error.errors[0].message
    }

    if (validatedFields.data) {
        try {
            const dp = await getDb();
            const user = new User();
            const { name, email, password } = validatedFields.data
            const userCount = await dp.manager.count(User);
            user.name = name;
            user.email = email;
            user.isAdmin = userCount === 0;
            user.password = await bcrypt.hash(password, 10);

            await dp.manager.save(user);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('unique')) {
                    return `Error while creating the user: This email is already registered. Please use a different email.`;
                }
                return `Error while creating the user: ${error.message}`;
            } else {
                return "An unknown error occurred while creating the user"
            }
        }
        try {
            await signIn('credentials', formData);
        } catch (err) {
            if (err instanceof AuthError) {
                return err.cause?.err?.message;
            }
        }
        redirect('/');
    }
}