import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@gmail.com',
  password: 'hashedpassword',
  roles: ['admin'],
  created_at: new Date(),
  updatedAt: new Date(),
};

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue([mockUser]);

      expect(await controller.findAll()).toEqual([mockUser]);
    });

    it('should throw an error if no users found', async () => {
      jest
        .spyOn(userService, 'findAll')
        .mockRejectedValue(new Error('No users found'));

      await expect(controller.findAll()).rejects.toThrow('No users found');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      const req = { user: { email: 'john@gmail.com' } };
      expect(await controller.getProfile(req)).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      jest
        .spyOn(userService, 'findByEmail')
        .mockRejectedValue(new Error('User not found'));

      const req = { user: { email: 'john@gmail.com' } };
      await expect(controller.getProfile(req)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
