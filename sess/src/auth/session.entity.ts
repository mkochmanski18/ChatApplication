import { User } from 'src/user/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

@Entity()
export class Session extends BaseEntity implements SessionEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    expiresAt: number;

    @Column()
    data: string;
}