import { signOut } from "@/auth";

import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function SignoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        className="flex items-center p-2 rounded-full hover:bg-gray-200 transition justify-center w-16 h-16"
        aria-label="Basket"
      >
        <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-gray-700" />
      </button>
    </form>
  );
}
