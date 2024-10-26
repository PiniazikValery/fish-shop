"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import Link from "next/link";

import { Basket } from "@/types/basket";
import { useMemo } from "react";

export default function BasketComponent() {
  const [basket] = useLocalStorage<Basket>("basket", {});
  const basketArr = useMemo(() => Object.values(basket), [basket]);
  const totalAmount = useMemo(
    () =>
      basketArr.reduce(
        (prevValue, item) =>
          (item ? item.count * item.product.price : 0) + prevValue,
        0
      ),
    [basketArr]
  );
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Basket</h1>

      {basketArr.length === 0 ? (
        <p className="text-lg">
          Your basket is empty. <Link href="/">Continue Shopping</Link>
        </p>
      ) : (
        <>
          <table className="table-auto w-full mb-6 text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Total</th>
                <th className="p-4">Remove</th>
              </tr>
            </thead>
            <tbody>
              {basketArr.map(
                (basketItem) =>
                  basketItem && (
                    <tr key={basketItem.product.id} className="border-b">
                      <td className="p-4">
                        {(() => {
                          return basketItem.product.name;
                        })()}
                      </td>
                      <td className="p-4">
                        BYN {Number(basketItem.product.price).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={basketItem.count}
                          readOnly
                          min="1"
                          className="w-16 p-2 border rounded"
                        />
                      </td>
                      <td className="p-4">
                        BYN{" "}
                        {(basketItem.product.price * basketItem.count).toFixed(
                          2
                        )}
                      </td>
                      <td>
                        <div className="flex justify-end">
                          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Total: BYN {totalAmount}</h2>
            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
              Clear Basket
            </button>
          </div>
          <Link href="/checkout">
            <button className="bg-blue-500 text-white px-6 py-3 rounded w-full text-center font-semibold hover:bg-blue-600 transition">
              Proceed to Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
