import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersSerivce: UsersService,
    private profileService: ProfilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<any> {
    const user = await this.usersSerivce.findOne(req.user.username);
    if (user) {
      const profileAll = await this.profileService.findProfile(user.id);

      if (profileAll) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, userId, ...profile } = profileAll;
        return profile;
      } else {
        throw new HttpException(
          'Profile Does Not Exist',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('User Does Not Exist', HttpStatus.BAD_REQUEST);
    }
  }
}
