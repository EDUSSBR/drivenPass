import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorators/users.decorator';
import { RemoveUserDto } from './dto/remove-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createAccount(createUserDto);
  }

  @Post('/signin')
  verifyUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.verifyAccount(createUserDto);
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteUser(
    @Body() removeUserDto: RemoveUserDto,
    @Param('id') id: string,
    @User() userId: number,
  ) {
    return this.usersService.removeAccount(parseInt(id), userId, removeUserDto);
  }
}
