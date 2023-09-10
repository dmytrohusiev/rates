import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
