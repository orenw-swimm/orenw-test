import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ClientStatus {
  NEW = 'חדש',
  CONTACTED = 'בקשר',
  MEETING = 'פגישה',
  OFFER_SENT = 'הצעה',
  WAITING = 'המתנה',
  WON = 'נסגר',
  LOST = 'לא רלוונטי',
}

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  // SQLite לא תומך ב-ENUM – אז נשתמש ב-VARCHAR
  @Column({ default: ClientStatus.NEW })
  status: ClientStatus;

  @Column({ default: 'ידני' })
  source: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
