"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import BasketComponent from "@/app/components/pages/Basket";

export default function BasketPage() {
  return (
    <ClientOnly>
      <BasketComponent />
    </ClientOnly>
  );
}
