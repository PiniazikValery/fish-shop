"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ProductSchema } from "@/app/lib/definitions/product-definitions";
import { getDb } from "@/db";
import { Product } from "@/db/entity/Product";

export async function createProduct(
  _prevState: string | undefined,
  formData: FormData
) {
  const validatedFields = ProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: +formData.get("price")!,
    img: formData.get("img"),
    quantity: +formData.get("quantity")!,
  });
  if (!validatedFields.success) {
    return validatedFields.error.errors[0].message;
  }

  if (validatedFields.data) {
    try {
      const dp = await getDb();
      const product = new Product();
      const { name, description, price, img, quantity } = validatedFields.data;
      product.name = name;
      product.description = description;
      product.price = price;
      product.img = img;
      product.quantity = quantity;
      await dp.manager.save(product);
      revalidatePath("/products", "page");
    } catch (error) {
      if (error instanceof Error) {
        return `Error while adding the product: ${error.message}`;
      } else {
        return "An unknown error occurred while adding the product";
      }
    }
    redirect("/");
  }
}
