import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesService } from './profiles/profiles.service';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [UsersModule, AuthModule, MessagesModule],
  controllers: [],
  providers: [PrismaService, ProfilesService],
})
export class AppModule {}
