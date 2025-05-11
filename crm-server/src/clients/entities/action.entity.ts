import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client)
  client: Client;

  @Column()
  description: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
