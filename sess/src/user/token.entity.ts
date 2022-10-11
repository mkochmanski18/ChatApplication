import { BaseEntity, Column, Entity,JoinColumn,OneToOne,PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Token extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    listId: string;

    @Column({
        length: 36,
    })
    resetTokenId:string;

    @Column({
        length: 36,
    })
    accessTokenId:string;

    @OneToOne(() => User)
    @JoinColumn()
    owner: User;
}