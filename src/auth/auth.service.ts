import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginResponseDto } from './dto/login.dto';
import { SignUpResponseDto } from './dto/signup.dto';
import { User } from '.prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<SignUpResponseDto | null> {
    const user: User | null = await this.usersService.findOne(username);
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<LoginResponseDto> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(
    username: string,
    pass: string,
  ): Promise<SignUpResponseDto | null> {
    const user: User | null = await this.usersService.createOne(username, pass);
    if (user) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }
}
