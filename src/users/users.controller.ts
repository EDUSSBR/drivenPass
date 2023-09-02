import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

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
}
