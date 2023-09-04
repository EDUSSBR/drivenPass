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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/users.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Credentials')
@ApiBearerAuth()
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'A credential was sucessfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The credential is with invalid body or missing properties',
  })
  @ApiOperation({ summary: 'create a new credential' })
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

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User should receive all their credentials',
  })
  @ApiOperation({ summary: 'get all users credential' })
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@User() userId: number) {
    return await this.credentialsService.findAll(userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'User should receive a specified credential if it belongs to the user',
  })
  @ApiOperation({ summary: 'get a specified credential' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @User() userId: number) {
    return await this.credentialsService.findOne(+id, userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated credential sucessfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cannot found this credential',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'This credential does not belong to the user',
  })
  @ApiOperation({ summary: 'update a specified credential' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCredentialDto: UpdateCredentialDto,
    @User() userId: number,
  ) {
    return this.credentialsService.update(+id, updateCredentialDto, userId);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not send a valid token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential was deleted sucessfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cannot found this credential',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'This credential does not belong to the user',
  })
  @ApiOperation({ summary: 'delete a credential' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @User() userId: number) {
    const deleted = await this.credentialsService.remove(+id, userId);
    return { id: deleted.id };
  }
}
