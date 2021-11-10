import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { ProfilesService } from './profiles.service';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../singleton';

describe('ProfilesService', () => {
  let profileService: ProfilesService;

  beforeEach(async () => {
    mockReset(prismaMock);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    profileService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });
  describe('findProfile', () => {
    it('should return a profile', async () => {
      const mockedProfile = {
        id: 1,
        name: 'John doe',
        bio: 'hello',
        userId: 1,
      };
      prismaMock.profile.findUnique.mockResolvedValue(mockedProfile);

      const profile = await profileService.findProfile(1);

      expect(profile).toBe(mockedProfile);
    });
    it('should return null if profile does not exist', async () => {
      prismaMock.profile.findUnique.mockResolvedValue(null);

      const profile = await profileService.findProfile(1);

      expect(profile).toBeNull();
    });
  });
});
