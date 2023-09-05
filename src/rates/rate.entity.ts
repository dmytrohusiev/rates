import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Symbol } from './symbol/symbol.entity';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  date: Date;

  @Column()
  price: number;

  @OneToOne(type => Symbol, sym => sym.name, { onDelete: 'RESTRICT' })
  @JoinColumn()
  symbol1: string;

  @OneToOne(type => Symbol, sym => sym.name, { onDelete: 'RESTRICT' })
  @JoinColumn()
  symbol2: string;
}
