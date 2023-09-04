import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto) {
    await this.prisma.users.create({ data: createUserDto });
  }
  async findUserByEmail(email: string) {
    return await this.prisma.users.findUnique({ where: { email } });
  }
  async findUserById(id: number) {
    return await this.prisma.users.findUnique({ where: { id } });
  }
  async removeUser(userId: number) {
    return await this.prisma.users.delete({ where: { id: userId } });
  }
}
