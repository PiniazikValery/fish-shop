import { getDb } from "@/db";
import { Product } from "@/db/entity/Product";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("search") || "";
  const db = await getDb();
  const productRepository = db.getMongoRepository(Product);

  let products;

  if (searchQuery) {
    products = await productRepository.find({
      where: { name: { $regex: `.*${searchQuery}.*`, $options: "i" } },
      order: { name: 1 },
    });
  } else {
    products = await productRepository.find({
      order: { name: 1 },
    });
  }

  return Response.json({ products });
}
