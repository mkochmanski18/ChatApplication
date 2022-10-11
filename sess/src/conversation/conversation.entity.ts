import { Message } from "src/message/message.entity";
import { ConversationTypeEnum } from "src/utils/types";
import { BaseEntity, Column, CreateDateColumn, Entity,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
@Entity()
export class Conversation extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    conversationId: string;

    @ManyToOne(() => User, user=>user.ownings)
    creator: User;

    @Column()
    name:string;

    @Column()
    conversationType: ConversationTypeEnum;

    @OneToMany(()=>Message,message=>message.conversation)
    @JoinColumn()
    messages: Message[];

    @Column()
    createdAt: Date;

    @ManyToMany(()=>User, user=>user.conversations)
    participants : User[];
}