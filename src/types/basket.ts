import { Product } from "@/db/entity/Product";

export interface Basket {
  [key: string]:
    | {
        product: Product;
        count: number;
      }
    | undefined;
}
