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
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/users.decorator';
import { CardsService } from './cards.service';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto, @User() userId: number) {
    try {
      await this.cardsService.create(createCardDto, userId);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'You cannot create a card with a title that has already been used.',
        );
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
    return 'CREATED';
  }

  @Get()
  findAll(@User() userId: number) {
    return this.cardsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() userId: number) {
    return this.cardsService.findOne(+id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @User() userId: number,
  ) {
    let updated;
    try {
      updated = await this.cardsService.update(+id, updateCardDto, userId);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'You cannot update a card title if it is already being used.',
        );
      } else if (error.status === 404) {
        throw new NotFoundException(
          'You cannot update a card that does not exists.',
        );
      } else if (error.status === 403) {
        throw new ForbiddenException(
          'You cannot update a card that does not exists.',
        );
      }
      console.log(error);
      throw new InternalServerErrorException();
    }
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() userId: number) {
    return this.cardsService.remove(+id, userId);
  }
}
