import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("chatId")
@Unique(["chatId"]) // Ensures that each chatId is unique
export class ChatId {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chatId!: number;
}
