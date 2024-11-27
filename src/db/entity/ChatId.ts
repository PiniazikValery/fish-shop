import { Entity, Column, ObjectIdColumn, Unique, ObjectId } from "typeorm";

@Entity("chatId")
@Unique(["chatId"]) // Ensures that each chatId is unique
export class ChatId {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  chatId!: number;
}
