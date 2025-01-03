"use client";
import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";

import { signupUser } from "@/app/lib/actions/auth";

export default function RegisterForm() {
  const t = useTranslations("Register");
  const [errorMessage, registerUser] = useFormState(signupUser, undefined);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        action={registerUser}
        className="max-w-md w-full mx-auto p-4 bg-white shadow-md rounded-md"
      >
        {errorMessage && (
          <div className="mb-4">
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("name")}
          </label>
          <input
            id="name"
            name="name"
            placeholder={t("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
            placeholder={t("email")}
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
            placeholder={t("password")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t("signUp")}
        </button>
      </form>
    </div>
  );
}
