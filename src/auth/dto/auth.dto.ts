import { IsStrongPassword, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;
}
