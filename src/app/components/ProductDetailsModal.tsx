"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

import { Product } from "@/db/entity/Product";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Basket } from "@/types/basket";

export default function ProductDetailsModal({
  children,
  product,
}: {
  children: React.ReactNode;
  product: Product;
}) {
  const [basket, saveInBasket] = useLocalStorage<Basket>("basket", {});
  const router = useRouter();
  const [finalModalIsOpen, setFinalModalIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [productsCount, setProductsCount] = useState(1);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll"); // Add class to disable scroll and add padding
    } else {
      document.body.classList.remove("no-scroll"); // Remove class to enable scroll
    }
    return () => {
      document.body.classList.remove("no-scroll"); // Cleanup on unmount
    };
  }, [isOpen]);
  const closeModal = useCallback((event: React.FormEvent) => {
    setFinalModalIsOpen(false);
    setIsOpen(false);
    setProductsCount(1);
    event.stopPropagation();
  }, []);
  const placeInBasket = useCallback(() => {
    const countInBasket = basket?.[product.id]?.count || 0;
    saveInBasket({
      ...basket,
      [product.id]: {
        product: { ...product, price: Number(product.price) },
        count: Math.min(countInBasket + productsCount, product.count),
      },
    });
    setFinalModalIsOpen(true);
  }, [basket, product, productsCount, saveInBasket]);
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  const handleIncrement = useCallback(
    () => setProductsCount(productsCount + 1),
    [productsCount]
  );
  const handleDecrement = useCallback(
    () => setProductsCount(productsCount - 1),
    [productsCount]
  );
  return (
    <div className="cursor-pointer" onClick={openModal}>
      {[
        children,
        isOpen &&
          createPortal(
            <div
              key={product.id}
              className="fixed inset-0 flex items-center justify-center z-30"
            >
              {/* Background overlay */}
              <div
                className="fixed inset-0 bg-gray-900 bg-opacity-50"
                onClick={closeModal}
              />

              {/* Modal content */}
              <div className="bg-white rounded-lg p-6 max-w-5xl w-full relative max-h-[90vh] overflow-y-scroll">
                <button
                  className="z-50 absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded-full w-12 h-12 flex items-center justify-center transition duration-200"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <span className="text-2xl cursor-pointer">&times;</span>
                </button>
                <div className="relative w-full h-[30rem]">
                  {product.img && (
                    <Image
                      fill={true}
                      src={product.img}
                      alt={product.name}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="p-6 pb-0">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold flex items-center">
                      {product.name}
                    </h2>
                  </div>
                  <div className="flex mb-6 justify-between">
                    <p className="text-lg font-bold text-gray-900 flex items-center pr-5">
                      BYN {Number(product.price).toFixed(2)}
                    </p>
                    <div className="flex">
                      <p
                        className={`flex mr-3 items-center text-sm font-medium ${
                          product.count > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {product.count > 0
                          ? `In Stock: ${product.count}`
                          : "Out of Stock"}
                      </p>
                      {basket[product.id]?.count && (
                        <p
                          className={`flex items-center text-sm font-medium text-orange-600`}
                        >
                          {`In Basket: ${basket[product.id]?.count}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="min-h-20">
                    <p className="text-gray-700 mb-6 max-h-32 overflow-y-scroll">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Product Count */}
                    <div className="flex items-center">
                      <button
                        className="bg-gray-300 text-gray-700 rounded-l px-3 py-1"
                        onClick={handleDecrement}
                        disabled={productsCount <= 1}
                      >
                        -
                      </button>
                      <span className="text-lg px-4">{productsCount}</span>
                      <button
                        className="bg-gray-300 text-gray-700 rounded-r px-3 py-1"
                        onClick={handleIncrement}
                        disabled={
                          productsCount + (basket[product.id]?.count || 0) >=
                          product.count
                        }
                      >
                        +
                      </button>
                    </div>
                    {/* Place in Basket Button */}
                    <button
                      className={`w-1/2 ml-4 font-semibold py-2 rounded transition duration-200 ${
                        product.count > 0
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                      disabled={
                        product.count === 0 ||
                        (basket[product.id]?.count || 0) >= product.count
                      }
                      onClick={placeInBasket}
                    >
                      Place in Basket
                    </button>
                  </div>
                </div>
              </div>
              {finalModalIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50"
                    onClick={closeModal}
                  />
                  <div className="bg-white rounded-lg p-6 max-w-5xl relative max-h-[90vh] overflow-y-scroll">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                      Added to basket
                    </h2>

                    <div className="flex justify-center space-x-4">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                        onClick={closeModal}
                      >
                        Continue shopping
                      </button>
                      <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => router.push("/basket")}
                      >
                        View basket
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>,
            document.getElementById("product-modal") as HTMLElement // The specific div for rendering
          ),
      ]}
    </div>
  );
}
