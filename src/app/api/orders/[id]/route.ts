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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: phoneNumber } = await params;

  try {
    const db = await getDb();
    const ordersRepository = db.getRepository(Order);

    const orders = await ordersRepository.find({
      where: { phone: phoneNumber },
    });

    if (!orders.length) {
      return new Response(`No orders found for phone number ${phoneNumber}`, {
        status: 404,
      });
    }

    return Response.json({
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response("An error occurred while fetching orders.", {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
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
    const { isRemove = false }: { isRemove: boolean } = await request.json();
    if (isRemove) {
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
                Number(product.quantity) +
                (order.basket[itemKey]?.quantity || 0);
              await productRepository.save(product);
              revalidatePath("/products", "page");
            }
          }
        })
      );
    }
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

export async function PATCH(request: Request) {
  try {
    const db = await getDb();
    const orderRepository = db.getRepository(Order);
    const productRepository = db.getRepository(Product);
    const { order: newOrder }: { order: Order } = await request.json();
    const oldOrder = await orderRepository.findOne({
      where: { id: newOrder.id },
    });
    await Promise.all(
      Object.keys(newOrder.basket).map(async (itemKey) => {
        const difference =
          (oldOrder?.basket[itemKey]?.quantity || 0) -
          (newOrder?.basket[itemKey]?.quantity || 0);
        const product = await productRepository.findOne({
          where: { id: +itemKey },
        });
        if (product) {
          product.quantity = Math.max(Number(product.quantity) + difference, 0);
          await productRepository.save(product);
          revalidatePath("/products", "page");
        }
      })
    );
    await orderRepository.save(newOrder);
    return Response.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (err) {
    console.error(err);
    return new Response("An error occurred while updating the order", {
      status: 500,
    });
  }
}
