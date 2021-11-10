import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { Public } from './decorators';
import { SignUpDto, SignUpResponseDto } from './dto/signup.dto';
import { LoginResponseDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('signup')
  async signUp(
    @Body() signupDto: SignUpDto,
  ): Promise<SignUpResponseDto | null> {
    const user = await this.authService.signUp(
      signupDto.username,
      signupDto.password,
    );

    if (user === null) {
      throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
