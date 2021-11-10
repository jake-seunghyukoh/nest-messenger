import { mockDeep } from 'jest-mock-extended';
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock';
import { PrismaService } from './prisma.service';
import prisma from './client';

jest.mock('./client', () => ({
  __esmodule: true,
  default: mockDeep<PrismaService>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaService>;
