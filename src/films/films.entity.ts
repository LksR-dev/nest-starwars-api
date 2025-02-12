import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  episode_id: number;

  @Column({ type: 'text' })
  description: string;

  @Column()
  director: string;

  @Column()
  release_date: string;
}
