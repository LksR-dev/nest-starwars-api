import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('films')
export class Film {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'A New Hope' })
  @Column()
  title: string;

  @ApiProperty({ example: 4, required: false })
  @Column({ nullable: true })
  episode_id: number;

  @ApiProperty({
    example:
      'It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base...',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 'George Lucas' })
  @Column()
  director: string;

  @ApiProperty({ example: '1977-05-25T03:00:00.000Z' })
  @Column({ type: 'timestamp', nullable: false })
  release_date: Date;
}
