import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(person: any) {
    const payload = { email: person.email, sub: person.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(personData: any) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(personData.password, salt);
    return this.userService.create({
      ...personData,
      password: hashedPassword,
    });
  }
}
