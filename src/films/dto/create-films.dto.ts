import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmDto {
  @ApiProperty({ example: 'A New Hope' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 4, required: false })
  @IsString()
  episode_id: number;

  @ApiProperty({ example: 'It is a period of civil war...' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'George Lucas' })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({ example: '1977-05-25' })
  @IsNotEmpty()
  @IsDateString()
  release_date: string;
}
