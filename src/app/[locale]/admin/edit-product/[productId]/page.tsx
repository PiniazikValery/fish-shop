"use client";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Product } from "@/db/entity/Product";

export default function EditProductPage() {
  const t = useTranslations("EditProduct");
  const router = useRouter();
  const params = useParams();
  const productId = params.productId;
  const [initQuantity, setInitQuantity] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      if (data.product) {
        setEditProduct({
          ...data.product,
          price: +data.product.price,
          quantity: +data.product.quantity,
        });
        setInitQuantity(data.product.quantity);
      }
    })();
  }, [setEditProduct, setInitQuantity, productId]);
  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: editProduct,
          quantityDiff: new Decimal(editProduct?.quantity || 0)
            .minus(new Decimal(initQuantity || 0))
            .toNumber(),
        }),
      });
      router.push("/");
      router.refresh();
    },
    [initQuantity, editProduct, router, productId]
  );
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div
        className={`w-full max-w-6xl rounded-lg shadow-md p-8 ${
          !editProduct
            ? "bg-gray-200 opacity-50 pointer-events-none"
            : "bg-white"
        }`}
      >
        <h1 className="text-2xl font-bold text-center mb-6">{t("title")}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">{t("name")}:</label>
            <input
              value={editProduct?.name || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct!, name: e.target.value })
              }
              disabled={!editProduct}
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">{t("description")}:</label>
            <textarea
              value={editProduct?.description || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct!, description: e.target.value })
              }
              disabled={!editProduct}
              name="description"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">{t("price")}:</label>
            <input
              value={editProduct?.price || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct!, price: +e.target.value })
              }
              disabled={!editProduct}
              type="number"
              name="price"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">{t("imageUrl")}:</label>
            <input
              value={editProduct?.img || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct!, img: e.target.value })
              }
              disabled={!editProduct}
              type="text"
              name="img"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">{t("quantity")}:</label>
            <input
              value={editProduct?.quantity}
              onChange={(e) =>
                setEditProduct({ ...editProduct!, quantity: +e.target.value })
              }
              disabled={!editProduct}
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
