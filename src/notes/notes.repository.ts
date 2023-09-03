import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteDto: CreateNoteDto, userId: number) {
    const { title, description } = createNoteDto;
    return this.prisma.notes.create({
      data: { title, description, userId },
    });
  }

  findAll(userId) {
    return this.prisma.notes.findMany({ where: { userId } });
  }

  findOne(id) {
    return this.prisma.notes.findFirst({ where: { id } });
  }

  update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const { title, description } = updateNoteDto;
    return this.prisma.notes.update({
      where: { userId, id },
      data: { title, description },
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.notes.delete({ where: { userId, id } });
  }
}
