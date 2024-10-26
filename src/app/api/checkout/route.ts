import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { CheckoutSchema } from "@/app/lib/definitions/checkout-definitions";
import { InMemoryQueue } from "@/app/api/utils";
import { getDb } from "@/db";
import { Order } from "@/db/entity/Order";
import { Product } from "@/db/entity/Product";

type CheckoutResponse = {
  success: boolean;
  message: string;
};

type CheckoutRequest = z.infer<typeof CheckoutSchema>;

const queue = new InMemoryQueue();

export async function POST(
  request: Request
): Promise<NextResponse<CheckoutResponse>> {
  try {
    const data: CheckoutRequest = CheckoutSchema.parse(await request.json());
    await queue.enqueue(async () => {
      const db = await getDb();
      const orderRepository = db.getRepository(Order);
      const productRepository = db.getRepository(Product);

      for (const [productId, { count }] of Object.entries(data.basket)) {
        const product = await productRepository.findOne({
          where: { id: parseInt(productId) },
        });

        if (!product) {
          throw new Error(`Product with ID ${productId} does not exist.`);
        }

        if (product.count < count) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Only ${product.count} left.`
          );
        }
      }

      for (const [productId, { count }] of Object.entries(data.basket)) {
        const product = await productRepository.findOne({
          where: { id: parseInt(productId) },
        });
        if (product) {
          product.count -= count;
          await productRepository.save(product);
        }
      }

      const order = orderRepository.create({
        name: data.name,
        phone: data.phone,
        address: data.address,
        courierDetails: data.courierDetails,
        basket: data.basket,
        status: "pending",
      });

      await orderRepository.save(order);
      revalidatePath("/products", "page");
    });
    return NextResponse.json({
      success: true,
      message: "Checkout processed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0].message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing checkout",
      },
      { status: 500 }
    );
  }
}
