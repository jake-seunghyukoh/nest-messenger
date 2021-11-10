import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../singleton';
import { User } from '.prisma/client';
import { ProfilesService } from '../profiles/profiles.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    mockReset(prismaMock);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
        ProfilesService,
      ],
      controllers: [UsersController],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a unique user if the user exist', async () => {
      const mockedUser: User = {
        id: 1,
        username: 'test',
        password: 'password',
      };
      prismaMock.user.findUnique.mockResolvedValue(mockedUser); // Mock find unique user

      const user = await service.findOne('username');

      expect(user).toBe(mockedUser);
    });

    it('should return null if the user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null); // Mock find unique user

      const user = await service.findOne('username');

      expect(user).toBeNull();
    });
  });

  describe('createOne', () => {
    it('should return a created user', async () => {
      const mockedUser: User = {
        id: 1,
        username: 'test',
        password: 'password',
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => null); // Mock findOne

      prismaMock.user.create.mockResolvedValue(mockedUser); // Mock create user

      const input = { username: 'test', password: 'password' };

      const user = await service.createOne(input.username, input.password);

      expect(user).toBe(mockedUser);
    });

    it('should return null if the user already exist', async () => {
      const mockedUser: User = {
        id: 1,
        username: 'test',
        password: 'password',
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => mockedUser); // Mock findOne

      const input = { username: 'test', password: 'password' };

      const user = await service.createOne(input.username, input.password);

      expect(user).toBeNull();
    });
  });
});
