import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity("product")
export class Product {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  img!: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 5,
  })
  quantity!: number;
}
