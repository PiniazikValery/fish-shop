"use client";

import { useFormState } from "react-dom";
import { useTranslations } from "next-intl";

import { createProduct } from "@/app/lib/actions/product";

export default function AddProductPage() {
  const [errorMessage, addProduct] = useFormState(createProduct, undefined);
  const t = useTranslations("AddProduct");
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">{t("title")}</h1>
        <form action={addProduct} className="space-y-4">
          {errorMessage && (
            <div>
              <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
            </div>
          )}
          <div>
            <label className="block text-gray-700">{t("name")}:</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">{t("description")}:</label>
            <textarea
              name="description"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">{t("price")}:</label>
            <input
              type="number"
              name="price"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">{t("imageUrl")}:</label>
            <input
              type="text"
              name="img"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">{t("quantity")}:</label>
            <input
              type="number"
              name="quantity"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {t("buttonTitle")}
          </button>
        </form>
      </div>
    </div>
  );
}
