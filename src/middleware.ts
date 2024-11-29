import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isAdmin = req.auth?.user?.isAdmin;
  const isAdminRoute = req.nextUrl.pathname.includes("/admin");
  if (isAdminRoute) {
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${req.url}`, req.url)
      );
    }
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/",
    "/(de|en)/:path*", // Match internationalized pathnames
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Your custom matcher
  ],
  unstable_allowDynamic: [
    "*Reflect.js",
    "**/node_modules/reflect-metadata/**/*.js",
    "**/node_modules/typeorm/**/*.js",
  ],
};
