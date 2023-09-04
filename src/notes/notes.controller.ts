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
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/users.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'A note was sucessfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The note is with invalid body or missing properties',
  })
  @ApiOperation({ summary: 'create a note' })
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @User() userId: number) {
    try {
      await this.notesService.create(createNoteDto, userId);
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User should receive all their notes',
  })
  @ApiOperation({ summary: 'find all users notes' })
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@User() userId: number) {
    return this.notesService.findAll(userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'User should receive a specified note if it belongs to the user',
  })
  @ApiOperation({ summary: 'get a specified note' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @User() userId: number) {
    return await this.notesService.findOne(+id, userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated note sucessfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cannot found this note',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'This note does not belong to the user',
  })
  @ApiOperation({ summary: 'update a specified note' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @User() userId: number,
  ) {
    return await this.notesService.update(+id, updateNoteDto, userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Note was deleted sucessfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cannot found this note',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'This note does not belong to the user',
  })
  @ApiOperation({ summary: 'delete a note' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() userId: number) {
    return await this.notesService.remove(+id, userId);
  }
}
