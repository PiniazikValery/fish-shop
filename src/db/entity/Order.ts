import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import type { Basket } from "@/types/basket";

@Entity("order")
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 15 })
  phone!: string;

  @Column("decimal", { array: true, precision: 9, scale: 6 })
  address!: [number, number];

  @Column({ type: "text", nullable: true })
  courierDetails?: string;

  @Column({ type: "varchar", length: 50, default: "pending" })
  status!: string;

  // Store the basket as JSON in the database
  @Column({ type: "json" })
  basket!: Basket;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
