"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Order } from "@/db/entity/Order";

export default function OrdersPage() {
  const params = useParams();
  const phoneNumber = params.phoneNumber;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders() {
    try {
      const response = await fetch(`/api/orders/+${phoneNumber}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError((err as Error)?.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (phoneNumber) {
      fetchOrders();
    }
  }, [phoneNumber]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (orders.length === 0)
    return (
      <p className="text-center text-gray-500">
        No orders found for this phone number.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Orders for Phone Number: +{phoneNumber}
      </h1>
      <ul className="space-y-6">
        {orders.map((order) => (
          <li
            key={order.id}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Order ID: {order.id}
              </h2>
              <p className="text-gray-600">
                <strong>Name:</strong> {order.name}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {order.phone}
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> {order.address.join(", ")}
              </p>
              <p className="text-gray-600">
                <strong>Courier Details:</strong>{" "}
                {order.courierDetails || "N/A"}
              </p>
              <p className="text-gray-600">
                <strong>Created At:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>Updated At:</strong>{" "}
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Basket</h3>
              <ul className="space-y-4 mt-2">
                {Object.entries(order.basket).map(([key, basketItem]) =>
                  basketItem ? (
                    <li
                      key={key}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                      <p className="text-gray-700">
                        <strong>Product Name:</strong> {basketItem.product.name}
                      </p>
                      <p className="text-gray-500">
                        <strong>Description:</strong>{" "}
                        {basketItem.product.description}
                      </p>
                      <p className="text-gray-500">
                        <strong>Price:</strong> $
                        {basketItem.product.price.toFixed(2)}
                      </p>
                      <p className="text-gray-500">
                        <strong>Quantity:</strong> {basketItem.quantity}
                      </p>
                      <p className="text-gray-700 font-semibold">
                        <strong>Total:</strong> $
                        {(
                          basketItem.product.price * basketItem.quantity
                        ).toFixed(2)}
                      </p>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
