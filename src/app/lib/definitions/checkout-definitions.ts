import { z } from "zod";
import { ProductSchema } from "@/app/lib/definitions/product-definitions";

export const CheckoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(
      /^\+375(25|29|33|44|17)\d{7}$/,
      "Phone number must be a valid Belarusian number (e.g., +375 29 1234567)"
    ),
  address: z
    .tuple([z.number(), z.number()])
    .refine(
      ([lat, lng]) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180,
      "Invalid coordinates"
    ),
  courierDetails: z.string().optional(),
  basket: z.record(
    z.string(),
    z.object({
      product: ProductSchema, // Reference the existing Product schema
      count: z.number().positive("Count must be a positive number"),
    })
  ),
});
