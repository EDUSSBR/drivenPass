import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/users.decorator';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @User() userId: number) {
    let created;
    try {
      created = await this.notesService.create(createNoteDto, userId);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'You cannot create a credential with a title that has already been used.',
        );
      }
      console.log(error);
      throw new InternalServerErrorException();
    }

    return 'CREATED';
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@User() userId: number) {
    return this.notesService.findAll(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @User() userId: number) {
    return await this.notesService.findOne(+id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @User() userId: number,
  ) {
    return await this.notesService.update(+id, updateNoteDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() userId: number) {
    return await this.notesService.remove(+id, userId);
  }
}
