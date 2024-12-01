"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";

import { signinUser } from "@/app/lib/actions/auth";

export default function LoginPage() {
  const t = useTranslations("Login");
  const [errorMessage, loginUser] = useFormState(signinUser, undefined);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        action={loginUser}
        className="max-w-md w-full mx-auto p-4 bg-white shadow-md rounded-md"
      >
        {errorMessage && (
          <div className="mb-4">
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              {" "}
              {t("rememberMe")}{" "}
            </label>
          </div>
          <div>
            <Link
              href="/auth/register"
              className="text-sm text-blue-500 hover:underline"
            >
              {t("noAccountYet")}
            </Link>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t("signIn")}
        </button>
      </form>
    </div>
  );
}
