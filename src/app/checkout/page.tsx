"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import Map from "@/app/components/Map";
import { useMap } from "@/app/providers/map-provider";

export default function BasketPage() {
  const { coordsToAddress } = useMap();
  return (
    <ClientOnly>
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>
        <form
          onSubmit={() => {}}
          className="space-y-4 flex flex-col items-center"
        >
          <div className="w-[50%]">
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={""}
              onChange={() => {}}
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
              value={""}
              onChange={() => {}}
              className={`mt-1 block w-full p-2 border border-gray-300 rounded-md`}
              placeholder="Your phone number"
            />
          </div>
          <div className="w-[50%]">
            <label htmlFor="address" className="block font-medium">
              Address
            </label>
          </div>
          <div className="w-[100%] !mt-0">
            <Map
              onLocationChange={async (lnglat) => {
                const address = coordsToAddress(lnglat);
                console.log("address: ", address);
              }}
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
