import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async login(userData: LoginDto) {
    const user = await this.validateUser(userData.email, userData.password);

    if (!user) {
      throw new Error('Incorrect email or password');
    }

    const payload = { sub: user.id, email: user.email, roles: user.roles };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    return this.userService.create({
      ...userData,
      password: hashedPassword,
    });
  }
}
