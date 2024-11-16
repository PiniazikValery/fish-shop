"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { Order } from "@/db/entity/Order";
import OrderRow from "@/app/components/OrderRow";

const getYandexMapsLink = (latitude: number, longitude: number) => {
  return `https://yandex.com/maps/?ll=${longitude},${latitude}&z=15&pt=${longitude},${latitude},pm2rdl`;
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const fetchOrders = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/orders");
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const handleRemoveOrder = async (orderId: number, isRemove: boolean) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        body: JSON.stringify({ isRemove }),
      });
      const data = await response.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        router.refresh();
      } else {
        console.error(data.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("An error occurred while deleting the order");
    }
  };

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-600 text-lg">
          There are no orders at the moment.
        </p>
        <p className="text-gray-500">
          Once orders are placed, they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Orders
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                ID
              </th>
              <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                Name
              </th>
              <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                Address
              </th>
              <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                Created At
              </th>
              <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                Updated At
              </th>
              <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr
                  onClick={() => toggleOrderExpansion(order.id)}
                  className="hover:bg-gray-50 transition-colors border-b cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-800">{order.id}</td>
                  <td className="px-6 py-4 text-gray-800">{order.name}</td>
                  <td className="px-6 py-4 text-gray-800">{order.phone}</td>
                  <td className="px-6 py-4 text-gray-800">
                    <a
                      href={getYandexMapsLink(
                        order.address[1],
                        order.address[0]
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View on map
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveOrder(order.id, false);
                      }}
                      className="text-red-500 flex items-center space-x-1"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveOrder(order.id, true);
                      }}
                      className="text-yellow-500 flex items-center space-x-1"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order.id && <OrderRow order={order} />}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
