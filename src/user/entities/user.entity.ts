import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('text', { array: true, default: ['regular'] })
  roles: string[];

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: new Date() })
  updatedAt: Date;
}
