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
  HttpStatus,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/users.decorator';
import { CardsService } from './cards.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'A card was sucessfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The card is with invalid body or missing properties',
  })
  @ApiOperation({ summary: 'Create a card' })
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

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User should receive all their cards',
  })
  @ApiOperation({ summary: "Get all user's cards" })
  @Get()
  findAll(@User() userId: number) {
    return this.cardsService.findAll(userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'User should receive a specified card if it belongs to the user',
  })
  @ApiOperation({ summary: 'Get a specified user card' })
  @Get(':id')
  findOne(@Param('id') id: string, @User() userId: number) {
    return this.cardsService.findOne(+id, userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated card sucessfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cannot found this card',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'This card does not belong to the user',
  })
  @ApiOperation({ summary: 'Update a card info' })
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

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card was deleted sucessfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cannot found this card',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'This card does not belong to the user',
  })
  @ApiOperation({ summary: 'delete a specified card' })
  @Delete(':id')
  remove(@Param('id') id: string, @User() userId: number) {
    return this.cardsService.remove(+id, userId);
  }
}
