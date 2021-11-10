import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfilesService } from '../profiles/profiles.service';

@Module({
  providers: [UsersService, PrismaService, ProfilesService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
