import { User as DefaultUser } from 'next-auth'
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User extends DefaultUser {
        isAdmin: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        isAdmin: boolean
    }
}