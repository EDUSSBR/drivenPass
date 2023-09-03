import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { NotesRepository } from './notes.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    NotesRepository,
    UsersService,
    UsersRepository,
    JwtService,
  ],
})
export class NotesModule {}
