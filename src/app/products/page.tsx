import Image from "next/image";

import { Product } from "@/db/entity/Product";

export default async function ProductPage() {
    const productsResponse = await fetch(process.env.NEXT_API_URL + '/products');
    if (!productsResponse.ok) {
        throw new Error('Failed to fetch posts');
    }
    const products: Product[] = (await productsResponse.json()).products;
    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10">Products</h1>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <li key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {product.img && (
                                <Image
                                    width={1080}
                                    height={1080}
                                    src={product.img}
                                    alt={product.name}
                                    className="h-48 w-full object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                <p className="text-gray-700 mb-4">{product.description}</p>
                                <p className="text-lg font-bold text-gray-900 mb-4">
                                    BYN {Number(product.price).toFixed(2)}
                                </p>
                                <p className={`text-sm font-medium mb-2 ${product.count > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.count > 0 ? `In Stock: ${product.count}` : 'Out of Stock'}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}