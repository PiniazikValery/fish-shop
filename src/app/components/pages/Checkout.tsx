"use client";
import { useCallback, useState } from "react";
import { LngLat } from "@yandex/ymaps3-types";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";

import { ClientOnly } from "@/app/components/ClientOnly";
import Map from "@/app/components/Map";
import { Basket } from "@/types/basket";

export default function CheckoutComponent() {
  const router = useRouter();
  const [basket, setBasket] = useLocalStorage<Basket>("basket", {});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<[number, number] | null>(null);
  const [courierDetails, setCourierDetails] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const onAddressChange = useCallback((lnglat: LngLat) => {
    const [lon, lat] = lnglat;
    setAddress([lon, lat]);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const checkoutData = {
        name,
        phone,
        address,
        courierDetails,
        basket,
      };
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkoutData),
        });
        const result = await response.json();
        if (response.ok) {
          setMessage(null);
          setBasket(Object.create(null));
          router.push("/");
        } else {
          setMessage(result.message);
        }
      } catch (error) {
        console.error("Checkout request failed:", error);
        setMessage("An error occurred while processing your checkout.");
      }
    },
    [name, phone, address, courierDetails, basket, router, setBasket]
  );

  return (
    <ClientOnly>
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col items-center"
        >
          {message && (
            <div className="mb-4">
              <p className="text-red-500 text-sm font-medium">{message}</p>
            </div>
          )}
          <div className="w-[50%]">
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md`}
              placeholder="Your full name"
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="phone" className="block font-medium">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md`}
              placeholder="Your phone number"
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="courierDetails" className="block font-medium">
              Details for Courier
            </label>
            <textarea
              id="courierDetails"
              name="courierDetails"
              value={courierDetails}
              onChange={(e) => setCourierDetails(e.target.value)}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md`}
              placeholder="Additional details for the courier (e.g., building, floor, specific instructions)"
              rows={3}
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="address" className="block font-medium">
              Address
            </label>
          </div>
          <div className="w-[100%] !mt-0">
            <Map
              onLocationChange={onAddressChange}
              width="100%"
              height="300px"
            />
          </div>

          <button
            type="submit"
            className="w-[50%] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </ClientOnly>
  );
}
