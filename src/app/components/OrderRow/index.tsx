import { useState, ChangeEvent, useCallback } from "react";
import cloneDeep from "lodash/cloneDeep";

import { Order } from "@/db/entity/Order";

interface OrderRowProps {
  order: Order;
}

export default function OrderRow({ order }: OrderRowProps) {
  const [localOrder, setLocalOrder] = useState(cloneDeep(order));
  const [orderChanged, setOrderChanged] = useState(false);
  const [updateInProcess, setUpdateInProcess] = useState(false);

  const onUpdateClick = useCallback(async () => {
    try {
      setUpdateInProcess(true);
      await fetch(`/api/orders/${localOrder.id}`, {
        method: "PATCH",
        body: JSON.stringify({ order: localOrder }),
      });
      setUpdateInProcess(false);
      setOrderChanged(false);
    } catch (error) {
      console.error(error);
    }
  }, [localOrder, setUpdateInProcess, setOrderChanged]);

  const onCountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setOrderChanged(true);
      const productId = Number(e.currentTarget.dataset.productId);
      setLocalOrder({
        ...localOrder,
        basket: {
          ...localOrder.basket,
          [productId]: {
            ...localOrder.basket[productId],
            quantity: Math.min(
              +e.target.value || 1,
              localOrder.basket[productId]!.product.quantity
            ),
          },
        },
      });
    },
    [localOrder, setLocalOrder, setOrderChanged]
  );
  return (
    <tr>
      <td colSpan={8} className="px-6 py-4 bg-gray-50">
        <div className="p-4 border border-gray-200 rounded-md flex flex-col items-baseline">
          <h3 className="text-lg font-semibold mb-2">Basket Items</h3>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Item Name
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Price
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(localOrder.basket).map((itemKey) => (
                <tr
                  key={localOrder.basket[itemKey]?.product.id}
                  className="border-b"
                >
                  <td className="px-4 py-2 text-gray-800">
                    {localOrder.basket[itemKey]?.product.name}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    <input
                      data-product-id={localOrder.basket[itemKey]?.product.id}
                      onChange={onCountChange}
                      type="number"
                      value={localOrder.basket[itemKey]?.quantity || ""}
                      min="1"
                      className="w-16 p-2 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {localOrder.basket[itemKey]?.product.price.toFixed(2)} BYN
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {(
                      (localOrder.basket[itemKey]?.product.price || 0) *
                      (localOrder.basket[itemKey]?.quantity || 0)
                    ).toFixed(2)}{" "}
                    BYN
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orderChanged && (
            <button
              onClick={onUpdateClick}
              disabled={updateInProcess} // Disable the button when loading
              className={`px-4 py-2 text-white ${
                updateInProcess
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } focus:ring-2 focus:ring-blue-300 rounded-lg transition duration-200 ease-in-out shadow-md self-end mt-2`}
            >
              {updateInProcess ? "Loading..." : "Update"}{" "}
              {/* Change text based on loading state */}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
