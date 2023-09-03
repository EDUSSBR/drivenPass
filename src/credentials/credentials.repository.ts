import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createCredentialDto: CreateCredentialDto, userId: number) {
    const { title, url, username, password } = createCredentialDto;
    return this.prisma.credentials.create({
      data: { title, url, username, password, userId },
    });
  }

  findAll(userId) {
    return this.prisma.credentials.findMany({ where: { userId } });
  }

  findOne(id) {
    return this.prisma.credentials.findFirst({ where: { id } });
  }

  update(id: number, updateCredentialDto: UpdateCredentialDto, userId: number) {
    const { title, url, username, password } = updateCredentialDto;
    return this.prisma.credentials.update({
      where: { userId, id },
      data: { title, url, username, password },
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.credentials.delete({ where: { userId, id } });
  }
}
