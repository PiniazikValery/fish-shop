import Image from "next/image";

import { Product } from "@/db/entity/Product";
import ProductDetailsModal from "@/app/components/ProductDetailsModal";
import { ClientOnly } from "@/app/components/ClientOnly";
import EditProductButton from "@/app/components/EditProductButton";
import { auth } from "@/auth";
import SearchProducts from "@/app/components/SearchProducts";

export default async function ProductPage(props: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  // console.log("search: ", search);
  const productsResponse = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/products?search=${search}`
  );
  if (!productsResponse.ok) {
    throw new Error("Failed to fetch posts");
  }
  const products: Product[] = (await productsResponse.json()).products;
  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="container mx-auto">
        <SearchProducts />
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={+product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <ClientOnly>
                <ProductDetailsModal product={product}>
                  <div className="relative w-full h-64">
                    {session?.user?.isAdmin && (
                      <EditProductButton productId={product._id.toString()} />
                    )}
                    {product.img && (
                      <Image
                        fill={true}
                        src={product.img}
                        alt={product.name}
                        className="h-48 w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      {product.name}
                    </h2>
                    <div className="min-h-20">
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-4">
                      BYN {Number(product.price).toFixed(2)}
                    </p>
                    <p
                      className={`text-sm font-medium mb-2 ${
                        product.quantity > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.quantity > 0
                        ? `In Stock: ${product.quantity}`
                        : "Out of Stock"}
                    </p>
                  </div>
                </ProductDetailsModal>
              </ClientOnly>
            </li>
          ))}
        </ul>
      </div>
      <div id="product-modal" />
    </div>
  );
}
