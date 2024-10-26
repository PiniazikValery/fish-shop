"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import CheckoutComponent from "@/app/components/pages/Checkout";

export default function CheckoutPage() {
  return (
    <ClientOnly>
      <CheckoutComponent />
    </ClientOnly>
  );
}
