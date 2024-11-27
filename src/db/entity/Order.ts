import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

import type { Basket } from "@/types/basket";

@Entity("order")
export class Order {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 15 })
  phone!: string;

  @Column("decimal", { array: true, precision: 9, scale: 6 })
  address!: [number, number];

  @Column({ type: "text", nullable: true })
  courierDetails?: string;

  // Store the basket as JSON in the database
  @Column({ type: "json" })
  basket!: Basket;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
