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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/users.decorator';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() userId: number,
  ) {
    try {
      await this.credentialsService.create(createCredentialDto, userId);
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
    return await this.credentialsService.findAll(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @User() userId: number) {
    return await this.credentialsService.findOne(+id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCredentialDto: UpdateCredentialDto,
    @User() userId: number,
  ) {
    return this.credentialsService.update(+id, updateCredentialDto, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() userId: number) {
    const deleted = await this.credentialsService.remove(+id, userId);
    return { id: deleted.id };
  }
}
