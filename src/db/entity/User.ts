import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity("user")
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ length: 100 })
  name!: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
