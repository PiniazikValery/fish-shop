import { z } from "zod";

export const ProductSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(255, { message: "Name cannot be longer than 255 characters." })
    .trim(),

  description: z
    .string()
    .min(1, { message: "Description is required." })
    .trim(),

  price: z
    .number()
    .positive({ message: "Price must be a positive number." })
    .max(99999999.99, { message: "Price cannot exceed 99,999,999.99." })
    .multipleOf(0.01, {
      message: "Price must be a valid decimal with two decimal places.",
    }),

  img: z
    .string()
    .url({ message: "Image must be a valid URL." })
    .max(255, { message: "Image URL cannot be longer than 255 characters." }),

  quantity: z
    .number()
    .nonnegative({ message: "Count must be zero or a positive integer." }),
});
