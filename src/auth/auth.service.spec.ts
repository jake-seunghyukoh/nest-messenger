import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { User } from '.prisma/client';
import { SignUpResponseDto } from './dto/signup.dto';
import { hash } from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '24h' },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      const mockedUser: User = {
        id: 1,
        username: 'username',
        password: await hash('password', 10),
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => mockedUser);

      const userInfo: SignUpResponseDto | null = await authService.validateUser(
        'username',
        'password',
      );
      expect(userInfo).not.toBeNull();
      expect(userInfo).toEqual({ id: 1, username: 'username' });
    });

    it('should return null with not existing user', async () => {
      jest.spyOn(usersService, 'findOne').mockImplementation(async () => null);

      const userInfo: SignUpResponseDto | null = await authService.validateUser(
        'username',
        'password',
      );
      expect(userInfo).toBeNull();
    });

    it('should return null with wrong password', async () => {
      const mockedUser: User = {
        id: 1,
        username: 'username',
        password: await hash('password', 10),
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => mockedUser);

      const userInfo: SignUpResponseDto | null = await authService.validateUser(
        'username',
        'wrong_password!!!!',
      );
      expect(userInfo).toBeNull();
    });
  });

  describe('login', () => {
    // Skip for now
  });

  describe('signUp', () => {
    it('should return a user if the user is created', async () => {
      const mockedUser: User = {
        id: 1,
        username: 'username',
        password: 'password',
      };
      jest
        .spyOn(usersService, 'createOne')
        .mockImplementation(async () => mockedUser);

      const userInfo = await authService.signUp('username', 'password');

      expect(userInfo).toEqual({ id: 1, username: 'username' });
    });

    it('should return null if user already exist', async () => {
      jest
        .spyOn(usersService, 'createOne')
        .mockImplementation(async () => null);

      const userInfo = await authService.signUp('username', 'password');

      expect(userInfo).toBeNull();
    });
  });
});
