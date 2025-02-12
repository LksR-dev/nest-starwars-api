import {
  IsString,
  IsStrongPassword,
  IsEmail,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsStrongPassword()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ default: ['regular', 'admin'] })
  @IsArray()
  readonly roles: string[];
}
