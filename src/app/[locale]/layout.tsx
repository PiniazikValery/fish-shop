import "reflect-metadata";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";
import { auth } from "@/auth";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  PlusCircleIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import "./globals.css";
import Logo from "../components/icons/Logo";
import Link from "next/link";
import { MapProvider } from "../providers/map-provider";
import SignoutButton from "../components/SignoutButton";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fish shop",
  description:
    "Discover the finest selection of fresh fish and seafood, delivered straight from the ocean to your table.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const session = await auth();
  if (!routing.locales.includes(locale as "en" | "ru")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="w-full flex items-center justify-between">
            <Link href="/products">
              <Logo width={150} height={150} />
            </Link>
            <div className="flex">
              {session?.user?.isAdmin && (
                <div className="flex">
                  <Link href="/admin/orders">
                    <button
                      className="flex items-center p-2 rounded-full hover:bg-gray-200 transition justify-center w-16 h-16"
                      aria-label="Basket"
                    >
                      <ListBulletIcon className="h-6 w-6 text-gray-700" />
                    </button>
                  </Link>
                  <Link href="/admin/add-product">
                    <button
                      className="flex items-center p-2 rounded-full hover:bg-gray-200 transition justify-center w-16 h-16"
                      aria-label="Basket"
                    >
                      <PlusCircleIcon className="h-6 w-6 text-gray-700" />
                    </button>
                  </Link>
                </div>
              )}
              <Link href="/basket">
                <button
                  className="flex items-center p-2 rounded-full hover:bg-gray-200 transition justify-center w-16 h-16"
                  aria-label="Basket"
                >
                  <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                </button>
              </Link>
              {session?.user ? (
                <SignoutButton />
              ) : (
                <Link href="/auth/login">
                  <button
                    className="flex items-center p-2 rounded-full hover:bg-gray-200 transition justify-center w-16 h-16"
                    aria-label="Basket"
                  >
                    <UserCircleIcon className="h-6 w-6 text-gray-700" />
                  </button>
                </Link>
              )}
            </div>
          </div>
          <MapProvider>{children}</MapProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
