"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import Map from "@/app/components/Map";

export default function BasketPage() {
  return (
    <ClientOnly>
      Checkout page
      <Map />
    </ClientOnly>
  );
}
