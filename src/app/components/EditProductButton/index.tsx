"use client";
import { useRouter } from "next/navigation";

import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";

interface EditProductButtonProps {
  productId: number;
}

export default function EditProductButton(props: EditProductButtonProps) {
  const router = useRouter();
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      router.push("/admin/edit-product/" + props.productId);
    },
    [router, props.productId]
  );
  return (
    <div className="absolute right-0 z-10 pt-2 pr-2" onClick={onClick}>
      <button
        type="button"
        className="flex items-center gap-2 px-2 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
