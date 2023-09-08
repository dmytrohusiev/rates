import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class CurrencySymbol {
  @PrimaryColumn()
  id: string;

  @Column('boolean', { default: true, nullable: false })
  isActive: boolean;

  @Column({ length: 100, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
