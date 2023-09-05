import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Symbol {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 10, nullable: false, unique: true })
  name: string;

  @Column('boolean', { default: true, nullable: false })
  isActive: boolean;

  @Column({ length: 100, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
