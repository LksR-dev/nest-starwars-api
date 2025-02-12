import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: 'john@gmail.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'password' })
  @Column()
  password: string;

  @ApiProperty({ example: ['regular'] })
  @Column('text', { array: true, default: ['regular'] })
  roles: string[];

  @ApiProperty({ example: new Date() })
  @Column({ default: new Date() })
  created_at: Date;

  @ApiProperty({ example: new Date() })
  @Column({ default: new Date() })
  updatedAt: Date;
}
