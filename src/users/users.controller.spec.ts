import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfilesService } from '../profiles/profiles.service';
import { Profile, User } from '.prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let usersSerivce: UsersService;
  let profilesService: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, ProfilesService],
      controllers: [UsersController],
    }).compile();

    controller = await module.resolve<UsersController>(UsersController);
    usersSerivce = await module.resolve<UsersService>(UsersService);
    profilesService = await module.resolve<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getProfile', () => {
    let user: User;
    let request: any;

    beforeAll(() => {
      user = {
        id: 1,
        username: 'johnDoe',
        password: 'password',
      };
      request = { user: user };
    });

    it('should return a user profile', async () => {
      const mockedProfile: Profile = {
        id: 1,
        name: 'John doe',
        bio: 'bio',
        userId: 1,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, userId, ...profile } = mockedProfile;

      jest.spyOn(usersSerivce, 'findOne').mockImplementation(async () => user);
      jest
        .spyOn(profilesService, 'findProfile')
        .mockImplementation(async () => mockedProfile);

      expect(controller.getProfile(request)).resolves.toStrictEqual(profile);
    });
    it('should throw an exception if user does not exist', () => {
      expect(controller.getProfile(request)).rejects.toEqual(
        new HttpException('User Does Not Exist', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
