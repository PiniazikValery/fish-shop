import { revalidatePath } from "next/cache";

import { getDb } from "@/db";
import { Order } from "@/db/entity/Order";
import { auth } from "@/auth";
import { Product } from "@/db/entity/Product";

export const dynamic = "force-dynamic";

async function deleteOrder(orderId: string) {
  const db = await getDb();
  const orderRepository = db.getRepository(Order);
  const deleteResult = await orderRepository.delete(orderId);
  return deleteResult.affected !== 0;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const id = (await params).id;
  if (!id || Array.isArray(id)) {
    return new Response("Invalid order ID", { status: 400 });
  }
  try {
    const orderDeleted = await deleteOrder(id);
    if (!orderDeleted) {
      return new Response("Order not found", { status: 404 });
    }
    return Response.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return new Response("An error occurred while deleting the order", {
      status: 500,
    });
  }
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  if (!id || Array.isArray(id)) {
    return new Response("Invalid order ID", { status: 400 });
  }
  try {
    const db = await getDb();
    const orderRepository = db.getRepository(Order);
    const productRepository = db.getRepository(Product);

    const order = await orderRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!order) {
      return new Response("Order not found", {
        status: 404,
      });
    }

    await Promise.all(
      Object.keys(order.basket).map(async (itemKey) => {
        const basketProduct = order.basket[itemKey]?.product;
        if (basketProduct) {
          const product = await productRepository.findOne({
            where: { id: +itemKey },
          });
          if (product) {
            product.quantity =
              Number(product.quantity) + (order.basket[itemKey]?.quantity || 0);
            console.log("product: ", product);
            await productRepository.save(product);
            revalidatePath("/products", "page");
          }
        }
      })
    );

    const orderDeleted = await deleteOrder(id);

    if (!orderDeleted) {
      return new Response("Order not found", { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Order canceled successfully",
    });
  } catch (error) {
    console.error(error);
    return new Response("An error occurred while canceling the order", {
      status: 500,
    });
  }
}
