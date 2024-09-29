import { auth } from '@/auth'

export default auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  unstable_allowDynamic: [
    '*Reflect.js',
    '**/node_modules/reflect-metadata/**/*.js',
    '**/node_modules/typeorm/**/*.js',
  ],
}
