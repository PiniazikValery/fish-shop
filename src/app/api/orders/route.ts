import { getDb } from "@/db";
import { Order } from "@/db/entity/Order";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const db = await getDb();
  const orderRepository = db.getRepository(Order);
  const orders = await orderRepository.find();

  return Response.json({ orders });
}
