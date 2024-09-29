import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// import bcrypt from 'bcryptjs';

// import { SigninFormSchema } from '@/app/lib/definitions'
// import { getDb } from '@/db'
// import { User } from "@/db/entity/User";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async () => {
        try {
          const user = null

          // const { email, password } = await SigninFormSchema.parseAsync(credentials)

          // logic to verify if the user exists
          // const db = await getDb();
          // user = await db.getRepository(User).findOne({ where: { email } })

          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
          }
          // if (!await bcrypt.compare(password, user?.password)) {
          //   throw new Error("Wrong password")
          // }

          // return user object with their profile data
          return user
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error(error.errors[0].message)
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      console.log('jwt');
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token
    },
    session({ session, token }) {
      console.log('session');
      session.user.isAdmin = token.isAdmin;
      return session
    },
    authorized: async ({ auth, request: { nextUrl } }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.isAdmin;
      console.log("user: ", auth?.user);
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      if (isAdminRoute) {
        return isLoggedIn && isAdmin;
      }
      return true;
    },
    redirect: async ({ url }) => {
      console.log('redirect url: ', url);
      return url;
    }
  },
})