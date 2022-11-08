import { ISession } from 'connect-typeorm';
import { BaseEntity, Column, DeleteDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

@Entity()
export class Session extends BaseEntity implements ISession {
    @Index()
    @Column('bigint')
    expiredAt: number = Date.now();

    @PrimaryColumn('varchar', { length: 255 })
    id: string;

    @Column('text')
    json: string;

    @DeleteDateColumn()
    destroyedAt: Date;
}