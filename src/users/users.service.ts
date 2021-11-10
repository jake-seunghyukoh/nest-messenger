import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | null> {
    const userWhereUniqueInput: Prisma.UserWhereUniqueInput = {
      username: username,
    };

    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createOne(username: string, password: string): Promise<User | null> {
    const user = await this.findOne(username);
    if (!user) {
      const hashedPassword = await hash(password, 10);
      const userCreateInput: Prisma.UserCreateInput = {
        username: username,
        password: hashedPassword,
      };
      return this.prisma.user.create({ data: userCreateInput });
    } else {
      return null;
    }
  }
}
