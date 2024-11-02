import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { SigninFormSchema } from "@/app/lib/definitions/auth-definitions";
import { getDb } from "@/db";
import { User } from "@/db/entity/User";
import { ZodError } from "zod";

const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } = await SigninFormSchema.parseAsync(
            credentials
          );

          // logic to verify if the user exists
          const db = await getDb();
          user = await db.getRepository(User).findOne({ where: { email } });

          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.");
          }
          if (!(await bcrypt.compare(password, user?.password))) {
            throw new Error("Wrong password");
          }

          // return user object with their profile data
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error(error.errors[0].message);
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    session({ session, token }) {
      session.user.isAdmin = token.isAdmin;
      return session;
    },
    authorized: async ({ auth, request: { nextUrl } }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.isAdmin;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      if (isAdminRoute) {
        return isLoggedIn && isAdmin;
      }
      return true;
    },
  },
};

const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export { handlers, signIn, signOut, auth };
