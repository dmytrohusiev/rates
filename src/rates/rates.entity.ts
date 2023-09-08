import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { CurrencySymbol } from './symbol/symbol.entity';

@Entity()
export class Rates {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp')
  date: Date;

  @Column('float')
  price: number;

  @Column({ length: 10, nullable: false })
  symbol1: string;

  @Column({ length: 10, nullable: false })
  symbol2: string;
}
