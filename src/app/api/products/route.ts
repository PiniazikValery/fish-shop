import { getDb } from "@/db";
import { Product } from "@/db/entity/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const productRepository = db.getRepository(Product);
  const products = await productRepository.find();

  return Response.json({ products });
}
