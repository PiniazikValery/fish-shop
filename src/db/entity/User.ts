import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ length: 100 })
    name!: string;

    @Column({ default: false })
    isAdmin!: boolean;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;
}