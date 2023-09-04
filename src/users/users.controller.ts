import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/users.decorator';
import { RemoveUserDto } from './dto/remove-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User was creted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "incorrect body or properties didn't met criterias",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'An account with same e-mail already exists ',
  })
  @ApiOperation({ summary: 'create a user' })
  @Post('/users/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createAccount(createUserDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Sucess, you should receive a token because all informations are valid',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "incorrect body or properties didn't met criterias",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid password',
  })
  @ApiOperation({ summary: 'make user signin' })
  @Post('/users/signin')
  verifyUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.verifyAccount(createUserDto);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User does not own account or send an invalid password',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User does not exists',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'User exists but have no authorization for doing it (trying deletion of other account)',
  })
  @ApiOperation({
    summary: 'remove an user account and all info attached to it',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/erase/:id')
  deleteUser(
    @Body() removeUserDto: RemoveUserDto,
    @Param('id') id: string,
    @User() userId: number,
  ) {
    return this.usersService.removeAccount(parseInt(id), userId, removeUserDto);
  }
}
