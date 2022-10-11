import { Conversation } from "src/conversation/conversation.entity";
import { Friend } from "src/friend/friend.entity";
import { UserRoleEnum } from "src/utils/types";
import { Message } from "src/message/message.entity";
import { BaseEntity, Column, Entity,JoinColumn,JoinTable,ManyToMany,OneToMany,OneToOne,PrimaryGeneratedColumn } from "typeorm";
import { Token } from "./token.entity";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    userid: string;

    @Column({
        length: 25,
    })
    name: string;

    @Column({
        length: 6,
    })
    sex: string;

    @Column({
        length: 25,
    })
    email: string;

    @Column({
        default: false,
    })
    confirmed: boolean;

    @Column()
    pwdHash: string;

    @Column({
        nullable:true,
        default: 1,
    })
    role:UserRoleEnum;

    @Column({
        nullable:true,
    })
    photo: string;

    @Column({
        nullable:true,
    })
    sessionId:string;

    @OneToOne(() => Token)
    tokens: Token[];

    @OneToMany(()=>Friend,friend=>friend.user)
    @JoinColumn()
    users: Friend[];
    
    @OneToMany(()=>Friend,friend=>friend.friend)
    @JoinColumn()
    friends: Friend[];

    @OneToMany(()=>Message,message=>message.sender)
    @JoinColumn()
    sends: Message[];

    @OneToMany(() => Conversation, conv=>conv.creator)
    @JoinColumn()
    ownings: Conversation[];

    @ManyToMany(()=>Conversation,conv=>conv.participants)
    @JoinTable()
    conversations : Conversation[];
}