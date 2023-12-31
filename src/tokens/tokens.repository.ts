import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokensRepository {
  constructor(private readonly prisma: PrismaService) {}
  async saveToken(token: string, userId: number) {
    await this.prisma.tokens.create({ data: { token, userId } });
  }
  async verifyToken(token) {
    return await this.prisma.tokens.findFirst({
      where: { token },
      include: { user: true },
    });
  }
}
