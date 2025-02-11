import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return this.userRepository.save(user);
    } catch (error) {
      throw new Error(`User with email: ${createUserDto.email} already exists`);
    }
  }

  findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new Error('No users found');
    }
  }

  findByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new Error(`User with email: ${email} not found`);
    }
  }
}
