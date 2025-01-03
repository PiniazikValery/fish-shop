import { z } from "zod";
import { NextResponse } from "next/server";
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

import { ProductSchema } from "@/app/lib/definitions/product-definitions";
import { getDb } from "@/db";
import { Product } from "@/db/entity/Product";

const PatchRequestSchema = z.object({
  product: ProductSchema,
  quantityDiff: z.number(),
});

type PatchProductRequest = z.infer<typeof PatchRequestSchema>;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const db = await getDb();
  const productRepository = db.getMongoRepository(Product);
  const product = await productRepository.findOneBy({
    _id: new ObjectId(productId),
  });

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json({ product });
}

export async function PATCH(request: Request) {
  try {
    const data: PatchProductRequest = PatchRequestSchema.parse(
      await request.json()
    );
    const { product: updatedProductData, quantityDiff } = data;

    const db = await getDb();
    const productRepository = db.getMongoRepository(Product);

    const existingProduct = await productRepository.findOneBy({
      _id: new ObjectId(updatedProductData._id),
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const newQuantity = Math.max(
      new Decimal(existingProduct.quantity)
        .plus(new Decimal(quantityDiff))
        .toNumber(),
      0
    );

    Object.assign(existingProduct, updatedProductData);

    existingProduct.quantity = newQuantity;
    const { _id, ...fieldsToUpdate } = existingProduct;

    await productRepository.updateOne(
      {
        _id: new ObjectId(_id),
      },
      { $set: fieldsToUpdate }
    );

    revalidatePath("/products", "page");
    return NextResponse.json({
      success: true,
      message: "Product has been updated successfully",
      product: existingProduct,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: err.errors[0].message,
        },
        { status: 400 }
      );
    }
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing checkout",
      },
      { status: 500 }
    );
  }
}
