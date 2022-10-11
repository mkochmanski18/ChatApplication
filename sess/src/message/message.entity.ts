import { Conversation } from "src/conversation/conversation.entity";
import { MessageTypeEnum } from "src/utils/types";
import { BaseEntity, Column, Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
@Entity()
export class Message extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    messageId: string;

    @Column()
    date: string;

    @Column({ type: 'timestamp' })
    datetime: Date;

    @Column()
    content:string;

    @Column()
    messageType:MessageTypeEnum;

    @ManyToOne(()=>User,user=>user.sends)
    sender: User;

    // @ManyToOne(()=>User,user=>user.messages)
    // destination: User;

    @ManyToOne(()=>Conversation,chat=>chat.messages)
    @JoinColumn()
    conversation:Conversation;
}