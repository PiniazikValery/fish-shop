"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import Link from "next/link";

import { Basket } from "@/types/basket";
import { ChangeEvent, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";

export default function BasketComponent() {
  const t = useTranslations("Basket");
  const [basket, setBasket] = useLocalStorage<Basket>("basket", {});
  const basketArr = useMemo(() => Object.values(basket), [basket]);
  const totalAmount = useMemo(
    () =>
      basketArr.reduce(
        (prevValue, item) =>
          (item ? item.quantity * item.product.price : 0) + prevValue,
        0
      ),
    [basketArr]
  );
  const onCountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const productId = e.currentTarget.dataset.productId!;
      if (productId && basket[productId]) {
        setBasket({
          ...basket,
          [productId]: {
            ...basket[productId],
            quantity: Math.min(
              +e.target.value || 1,
              basket[productId]!.product.quantity
            ),
          },
        });
      }
    },
    [basket, setBasket]
  );
  const onRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const productId = Number(e.currentTarget.dataset.productId);
      const newBasket = { ...basket };
      delete newBasket[productId];
      setBasket(newBasket);
    },
    [basket, setBasket]
  );
  const onClear = useCallback(() => {
    setBasket(Object.create(null));
  }, [setBasket]);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("yourBasket")}</h1>

      {basketArr.length === 0 ? (
        <p className="text-lg">
          {t("emptyBasket")} <Link href="/">{t("continueShopping")}</Link>
        </p>
      ) : (
        <>
          <table className="table-auto w-full mb-6 text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4">{t("product")}</th>
                <th className="p-4">{t("price")}</th>
                <th className="p-4">{t("quantity")}</th>
                <th className="p-4">{t("total")}</th>
                <th className="p-4">{t("remove")}</th>
              </tr>
            </thead>
            <tbody>
              {basketArr.map(
                (basketItem) =>
                  basketItem && (
                    <tr
                      key={basketItem.product._id.toString()}
                      className="border-b"
                    >
                      <td className="p-4 w-1/5">
                        {(() => {
                          return basketItem.product.name;
                        })()}
                      </td>
                      <td className="p-4 w-1/5">
                        BYN {Number(basketItem.product.price).toFixed(2)}
                      </td>
                      <td className="p-4 w-1/5">
                        <input
                          data-product-id={basketItem.product._id.toString()}
                          onChange={onCountChange}
                          type="number"
                          value={basketItem.quantity || ""}
                          min="1"
                          className="w-16 p-2 border rounded"
                        />
                      </td>
                      <td className="p-4 w-1/5">
                        BYN{" "}
                        {(
                          basketItem.product.price * basketItem.quantity
                        ).toFixed(2)}
                      </td>
                      <td className="p-4 w-1/5">
                        <div className="flex justify-end">
                          <button
                            data-product-id={basketItem.product._id.toString()}
                            onClick={onRemove}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                          >
                            {t("remove")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {t("total")}: BYN {totalAmount}
            </h2>
            <button
              onClick={onClear}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              {t("clearBasket")}
            </button>
          </div>
          <Link href="/checkout">
            <button className="bg-blue-500 text-white px-6 py-3 rounded w-full text-center font-semibold hover:bg-blue-600 transition">
              {t("goToCheckout")}
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
