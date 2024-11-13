"use client";
import { useParams } from "next/navigation";

export default function OrdersPage() {
  const params = useParams();
  const phoneNumber = params.phoneNumber;

  return `Orders Page: ${phoneNumber}`;
}
