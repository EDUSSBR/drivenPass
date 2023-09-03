import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}
  create(createNoteDto: CreateNoteDto, userId) {
    return this.notesRepository.create(createNoteDto, userId);
  }

  findAll(userId: number) {
    return this.notesRepository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const note = await this.notesRepository.findOne(id);
    if (!note) {
      throw new NotFoundException('Note found note.');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('This note is not available.');
    }
    return { id: note.id, title: note.title, description: note.description };
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const note = await this.findOne(id, userId);
    const updatedNote = { ...note, ...updateNoteDto };
    await this.notesRepository.update(id, updatedNote, userId);
    return updatedNote;
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await this.notesRepository.remove(id, userId);
    return 'DELETED';
  }
}
