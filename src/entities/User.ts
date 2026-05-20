import {
    Entity,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { ObjectId } from "mongodb"

@Entity("users")
export class User {
    @ObjectIdColumn()
    _id!: ObjectId

    @Column({ unique: true })
    email!: string

    @Column()
    name!: string

    @Column()
    password!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
