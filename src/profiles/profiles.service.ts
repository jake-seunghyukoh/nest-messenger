import { Prisma, Profile } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}
  findProfile(userId: number): Promise<Profile | null> {
    const profileWhereUniqueInput: Prisma.ProfileWhereUniqueInput = {
      userId: userId,
    };

    return this.prisma.profile.findUnique({
      where: profileWhereUniqueInput,
    });
  }
}
