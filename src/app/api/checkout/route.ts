import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ObjectId } from "mongodb";

import { OrderSchema } from "@/app/lib/definitions/order-definitions";
import { InMemoryQueue } from "@/app/api/utils";
import { getDb } from "@/db";
import { Order } from "@/db/entity/Order";
import { Product } from "@/db/entity/Product";
import { bot } from "@/app/lib/telegram";
import { ChatId } from "@/db/entity/ChatId";

const getYandexMapsLink = (latitude: number, longitude: number) => {
  return `https://yandex.com/maps/?ll=${longitude},${latitude}&z=15&pt=${longitude},${latitude},pm2rdl`;
};

type CheckoutResponse = {
  success: boolean;
  message: string;
};

type CheckoutRequest = z.infer<typeof OrderSchema>;

const queue = new InMemoryQueue();

export async function POST(
  request: Request
): Promise<NextResponse<CheckoutResponse>> {
  try {
    const data: CheckoutRequest = OrderSchema.parse(await request.json());
    await queue.enqueue(async () => {
      const db = await getDb();
      const orderRepository = db.getMongoRepository(Order);
      const productRepository = db.getMongoRepository(Product);
      const chatIdRepository = db.getMongoRepository(ChatId);

      for (const [productId, { quantity }] of Object.entries(data.basket)) {
        const product = await productRepository.findOneBy({
          _id: new ObjectId(productId),
        });

        if (!product) {
          throw new Error(`Product with ID ${productId} does not exist.`);
        }

        if (product.quantity < quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Only ${product.quantity} left.`
          );
        }
      }

      for (const [productId, { quantity }] of Object.entries(data.basket)) {
        const product = await productRepository.findOneBy({
          _id: new ObjectId(productId),
        });
        if (product) {
          product.quantity -= quantity;
          // await productRepository.save(product);
          const { _id, ...fieldsToUpdate } = product;

          await productRepository.updateOne(
            {
              _id: new ObjectId(_id),
            },
            { $set: fieldsToUpdate }
          );
        }
      }

      const order = orderRepository.create({
        name: data.name,
        phone: data.phone,
        address: data.address,
        courierDetails: data.courierDetails,
        basket: data.basket,
      });

      await orderRepository.save(order);
      const orderDetailsMessage = `🛒 *Order Created Successfully!*

      Hello, a new order has been created

      *Order Details:*
      \- **Name:** ${order.name}
      \- **Phone:** ${order.phone}
      \- **Address:** [View on Yandex Maps](${getYandexMapsLink(
        order.address[1],
        order.address[0]
      )})
      \- **Courier Instructions:** ${order.courierDetails || "None"}

      *Products:*
      ${Object.entries(data.basket)
        .map(
          ([, { quantity, product }]) =>
            `\- ${quantity} x ${product.name || "Unknown Product"}`
        )
        .join("\n")}

      Thank you for choosing our service! 🚀`;
      for (const chat of await chatIdRepository.find()) {
        try {
          await bot.api.sendMessage(chat.chatId, orderDetailsMessage, {
            parse_mode: "Markdown",
          });
        } catch (error) {
          console.error(
            `Failed to send message to chatId ${chat.chatId}:`,
            error
          );
        }
      }
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
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing checkout",
      },
      { status: 500 }
    );
  }
}
